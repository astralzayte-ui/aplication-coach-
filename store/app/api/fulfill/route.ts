import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Order } from '@/lib/types';
import { fulfillOrder } from '@/lib/fulfillment';

export async function POST(request: NextRequest) {
  try {
    const { orderId, supplierUrl } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(orderId, orderId) as Order | undefined;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

    // Use provided supplier URL or get from order items
    const url = supplierUrl || (orderItems[0]?.product?.supplier_url) || '';

    if (!url) {
      return NextResponse.json({ error: 'No supplier URL provided' }, { status: 400 });
    }

    // Update status to in-progress
    db.prepare("UPDATE orders SET fulfillment_status = 'in_progress', updated_at = datetime('now') WHERE id = ?").run(order.id);

    const fullOrder: Order = {
      ...order,
      items: orderItems,
      fulfillment_log: [],
    };

    // Run fulfillment
    const result = await fulfillOrder(fullOrder, url);

    // Update order with result
    const currentLog = typeof order.fulfillment_log === 'string' ? JSON.parse(order.fulfillment_log) : [];
    const newLog = [...currentLog, ...result.logs];

    db.prepare(`
      UPDATE orders SET
        fulfillment_status = ?,
        fulfillment_log = ?,
        status = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      result.success ? 'completed' : 'failed',
      JSON.stringify(newLog),
      result.success ? 'processing' : 'fulfillment_failed',
      order.id
    );

    return NextResponse.json({ success: result.success, message: result.message, logs: result.logs });

  } catch (error) {
    console.error('Fulfill error:', error);
    return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 });
  }
}
