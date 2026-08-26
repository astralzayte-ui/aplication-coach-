import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Product } from '@/lib/types';
import { writeFile } from 'fs/promises';
import path from 'path';

// GET all products (with optional category filter)
export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const active = searchParams.get('active');

  let query = 'SELECT * FROM products WHERE 1=1';
  const params: (string | number)[] = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (featured === 'true') {
    query += ' AND featured = 1';
  }
  if (active !== 'false') {
    query += ' AND active = 1';
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params) as Product[];

  const products = rows.map(p => ({
    ...p,
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
  }));

  return NextResponse.json(products);
}

// POST create product (admin)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const original_price = formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : null;
    const category = formData.get('category') as string;
    const supplier_url = formData.get('supplier_url') as string;
    const supplier_name = formData.get('supplier_name') as string;
    const stock = parseInt(formData.get('stock') as string) || 100;
    const sizes = formData.get('sizes') as string;
    const colors = formData.get('colors') as string;
    const featured = formData.get('featured') === 'true' ? 1 : 0;
    const imageFile = formData.get('image') as File | null;

    let image_url = formData.get('image_url') as string || '';

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = imageFile.name.split('.').pop() || 'jpg';
      const filename = `product_${Date.now()}.${ext}`;
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(uploadPath, buffer);
      image_url = `/uploads/${filename}`;
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO products (name, description, price, original_price, category, image_url, supplier_url, supplier_name, stock, sizes, colors, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, description, price, original_price, category,
      image_url, supplier_url, supplier_name, stock,
      sizes || '[]', colors || '[]', featured
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid) as Product;

    return NextResponse.json({
      ...product,
      sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
      colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
    }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
