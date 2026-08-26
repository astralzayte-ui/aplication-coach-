import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Product } from '@/lib/types';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...product,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
    colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const formData = await request.formData();
    const db = getDb();

    const fields: Record<string, string | number | null> = {};
    const allowedFields = ['name', 'description', 'price', 'original_price', 'category', 'supplier_url', 'supplier_name', 'stock', 'sizes', 'colors', 'featured', 'active', 'image_url'];

    for (const field of allowedFields) {
      const val = formData.get(field);
      if (val !== null) {
        if (field === 'price' || field === 'original_price') {
          fields[field] = val ? parseFloat(val as string) : null;
        } else if (field === 'stock' || field === 'featured' || field === 'active') {
          fields[field] = parseInt(val as string);
        } else {
          fields[field] = val as string;
        }
      }
    }

    // Handle image upload
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = imageFile.name.split('.').pop() || 'jpg';
      const filename = `product_${Date.now()}.${ext}`;
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(uploadPath, buffer);
      fields['image_url'] = `/uploads/${filename}`;
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    db.prepare(`UPDATE products SET ${setClause} WHERE id = ?`).run(...values);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product;
    return NextResponse.json({
      ...product,
      sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
      colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare('UPDATE products SET active = 0 WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
