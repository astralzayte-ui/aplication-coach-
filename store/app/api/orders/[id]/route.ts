import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Order } from '@/lib/types';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id) as Order | undefined;

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    fulfillment_log: typeof order.fulfillment_log === 'string' ? JSON.parse(order.fulfillment_log) : order.fulfillment_log,
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await request.json();
  const { status, payment_status, fulfillment_status, fulfillment_log } = body;

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (status) { updates.push('status = ?'); values.push(status); }
  if (payment_status) { updates.push('payment_status = ?'); values.push(payment_status); }
  if (fulfillment_status) { updates.push('fulfillment_status = ?'); values.push(fulfillment_status); }
  if (fulfillment_log) { updates.push('fulfillment_log = ?'); values.push(JSON.stringify(fulfillment_log)); }

  updates.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ? OR order_number = ?`).run(...values, id);

  const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id) as Order;
  return NextResponse.json({
    ...order,
    items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
  });
}
