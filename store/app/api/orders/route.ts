import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Order } from '@/lib/types';

function generateOrderNumber(): string {
  const prefix = 'DRIP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = 'SELECT * FROM orders';
  const params: string[] = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit.toString());

  const rows = db.prepare(query).all(...params) as Order[];

  const orders = rows.map(o => ({
    ...o,
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
    fulfillment_log: typeof o.fulfillment_log === 'string' ? JSON.parse(o.fulfillment_log) : o.fulfillment_log,
  }));

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_postal,
      shipping_country,
      items,
      total,
    } = body;

    if (!customer_name || !customer_email || !shipping_address || !items || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const order_number = generateOrderNumber();

    const result = db.prepare(`
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        shipping_address, shipping_city, shipping_postal, shipping_country,
        items, total, status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `).run(
      order_number, customer_name, customer_email, customer_phone || null,
      shipping_address, shipping_city, shipping_postal, shipping_country || 'France',
      JSON.stringify(items), total
    );

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid) as Order;

    return NextResponse.json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
