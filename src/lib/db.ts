// D1 query helpers — raw SQL, no ORM
import type {
  Batch, Product, Order, OrderItem, OrderFilters,
  CreateOrderInput, DashboardStats, SalesSummaryRow
} from '../types';

// ── Batch helpers ──────────────────────────────────────────────────────────

export function isBatchOpen(batch: Batch): boolean {
  const now = Math.floor(Date.now() / 1000);
  return batch.status === 'open' && (!batch.close_at || now < batch.close_at);
}

export async function getOpenBatch(db: D1Database): Promise<Batch | null> {
  const row = await db
    .prepare(`SELECT * FROM batches WHERE status = 'open' ORDER BY created_at DESC LIMIT 1`)
    .first<Batch>();
  return row ?? null;
}

export async function getBatches(db: D1Database): Promise<Batch[]> {
  const { results } = await db.prepare(`SELECT * FROM batches ORDER BY created_at DESC`).all<Batch>();
  return results;
}

export async function closeBatch(db: D1Database, id: string): Promise<void> {
  await db.prepare(`UPDATE batches SET status = 'closed' WHERE id = ?`).bind(id).run();
}

// ── Product helpers ────────────────────────────────────────────────────────

function parseProduct(row: Record<string, unknown>): Product {
  return {
    ...(row as Product),
    images: JSON.parse((row.images as string) || '[]'),
    has_variants: row.has_variants === 1 || row.has_variants === true,
    active: row.active === 1 || row.active === true,
    variants_config: row.variants_config ? JSON.parse(row.variants_config as string) : null,
  };
}

export async function getProducts(db: D1Database, batchId: string): Promise<Product[]> {
  const { results } = await db
    .prepare(`SELECT * FROM products WHERE batch_id = ? AND active = 1 ORDER BY sort_order`)
    .bind(batchId)
    .all<Record<string, unknown>>();
  return results.map(parseProduct);
}

export async function getAllProducts(db: D1Database, batchId: string): Promise<Product[]> {
  const { results } = await db
    .prepare(`SELECT * FROM products WHERE batch_id = ? ORDER BY sort_order`)
    .bind(batchId)
    .all<Record<string, unknown>>();
  return results.map(parseProduct);
}

export async function getProductById(db: D1Database, id: string): Promise<Product | null> {
  const row = await db
    .prepare(`SELECT * FROM products WHERE id = ?`)
    .bind(id)
    .first<Record<string, unknown>>();
  return row ? parseProduct(row) : null;
}

export async function updateProduct(db: D1Database, id: string, fields: Partial<Pick<Product, 'name' | 'price' | 'description' | 'active' | 'image_url'>>): Promise<void> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (fields.name !== undefined)        { sets.push('name = ?');        vals.push(fields.name); }
  if (fields.price !== undefined)       { sets.push('price = ?');       vals.push(fields.price); }
  if (fields.description !== undefined) { sets.push('description = ?'); vals.push(fields.description); }
  if (fields.active !== undefined)      { sets.push('active = ?');      vals.push(fields.active ? 1 : 0); }
  if (fields.image_url !== undefined)   { sets.push('image_url = ?');   vals.push(fields.image_url); }
  if (!sets.length) return;
  vals.push(id);
  await db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
}

// ── Order helpers ──────────────────────────────────────────────────────────

function parseOrder(row: Record<string, unknown>): Order {
  return { ...(row as Order), items: JSON.parse((row.items as string) || '[]') };
}

export async function getNextOrderSeq(db: D1Database, batchId: string): Promise<number> {
  const row = await db
    .prepare(`SELECT next_seq FROM order_sequence WHERE batch_id = ?`)
    .bind(batchId)
    .first<{ next_seq: number }>();
  return row?.next_seq ?? 1;
}

export async function createOrder(db: D1Database, data: CreateOrderInput): Promise<string> {
  const seq = await getNextOrderSeq(db, data.batch_id);
  await db.prepare(`UPDATE order_sequence SET next_seq = next_seq + 1 WHERE batch_id = ?`).bind(data.batch_id).run();
  const orderId = `SIE-2026-${String(seq).padStart(4, '0')}`;
  await db.prepare(`
    INSERT INTO orders (id, batch_id, customer_name, phone, delivery_method, address, items, subtotal, shipping_fee, total, notes, email, facebook_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    orderId, data.batch_id, data.customer_name, data.phone,
    data.delivery_method, data.address,
    JSON.stringify(data.items), data.subtotal, data.shipping_fee, data.total, data.notes,
    data.email, data.facebook_url
  ).run();
  return orderId;
}

export async function getOrderById(db: D1Database, id: string): Promise<Order | null> {
  const row = await db
    .prepare(`SELECT * FROM orders WHERE id = ?`)
    .bind(id)
    .first<Record<string, unknown>>();
  return row ? parseOrder(row) : null;
}

export async function getOrdersByBatch(db: D1Database, filters: OrderFilters): Promise<Order[]> {
  const conditions: string[] = ['1=1'];
  const vals: unknown[] = [];
  if (filters.batch_id)       { conditions.push('batch_id = ?');       vals.push(filters.batch_id); }
  if (filters.order_status)   { conditions.push('order_status = ?');   vals.push(filters.order_status); }
  if (filters.payment_status) { conditions.push('payment_status = ?'); vals.push(filters.payment_status); }
  const offset = ((filters.page ?? 1) - 1) * 1000;
  vals.push(1000, offset);
  const { results } = await db
    .prepare(`SELECT * FROM orders WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(...vals)
    .all<Record<string, unknown>>();
  return results.map(parseOrder);
}

export async function getOrdersByPhone(db: D1Database, phone: string): Promise<Order[]> {
  const { results } = await db
    .prepare(`SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC`)
    .bind(phone)
    .all<Record<string, unknown>>();
  return results.map(parseOrder);
}

export async function getRecentOrders(db: D1Database, batchId: string, limit = 20): Promise<Order[]> {
  const { results } = await db
    .prepare(`SELECT * FROM orders WHERE batch_id = ? ORDER BY created_at DESC LIMIT ?`)
    .bind(batchId, limit)
    .all<Record<string, unknown>>();
  return results.map(parseOrder);
}

export async function updateOrderStatus(db: D1Database, id: string, status: string): Promise<void> {
  await db.prepare(`UPDATE orders SET order_status = ? WHERE id = ?`).bind(status, id).run();
}

export async function updatePaymentStatus(db: D1Database, id: string, status: string): Promise<void> {
  await db.prepare(`UPDATE orders SET payment_status = ? WHERE id = ?`).bind(status, id).run();
}

export async function getDashboardStats(db: D1Database, batchId: string): Promise<DashboardStats> {
  const today = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const [total, todayOrders, confirmed, pendingPay, revenue, pendingRev] = await Promise.all([
    db.prepare(`SELECT COUNT(*) as c FROM orders WHERE batch_id = ?`).bind(batchId).first<{ c: number }>(),
    db.prepare(`SELECT COUNT(*) as c FROM orders WHERE batch_id = ? AND created_at >= ?`).bind(batchId, today).first<{ c: number }>(),
    db.prepare(`SELECT COUNT(*) as c FROM orders WHERE batch_id = ? AND order_status = 'confirmed'`).bind(batchId).first<{ c: number }>(),
    db.prepare(`SELECT COUNT(*) as c FROM orders WHERE batch_id = ? AND payment_status = 'awaiting'`).bind(batchId).first<{ c: number }>(),
    db.prepare(`SELECT COALESCE(SUM(total),0) as s FROM orders WHERE batch_id = ? AND payment_status = 'verified'`).bind(batchId).first<{ s: number }>(),
    db.prepare(`SELECT COALESCE(SUM(total),0) as s FROM orders WHERE batch_id = ? AND payment_status = 'awaiting'`).bind(batchId).first<{ s: number }>(),
  ]);
  return {
    total_orders: total?.c ?? 0,
    confirmed_orders: confirmed?.c ?? 0,
    pending_payment: pendingPay?.c ?? 0,
    total_revenue: revenue?.s ?? 0,
    pending_revenue: pendingRev?.s ?? 0,
  };
}

// Aggregate order items by product/color/size with breakdown by status
export async function getSalesSummary(db: D1Database, batchId: string): Promise<SalesSummaryRow[]> {
  const { results } = await db
    .prepare(`SELECT items, payment_status, order_status FROM orders WHERE batch_id = ?`)
    .bind(batchId)
    .all<{ items: string; payment_status: string; order_status: string }>();
  const map = new Map<string, SalesSummaryRow>();
  for (const row of results) {
    const items: OrderItem[] = JSON.parse(row.items || '[]');
    const isCancelled = row.order_status === 'cancelled';
    for (const item of items) {
      const key = `${item.name}|${item.color ?? ''}|${item.size ?? ''}`;
      let entry = map.get(key);
      if (!entry) {
        entry = { product_name: item.name, color: item.color ?? null, size: item.size ?? null, total_qty: 0, verified_qty: 0, awaiting_qty: 0, cancelled_qty: 0 };
        map.set(key, entry);
      }
      if (isCancelled) {
        entry.cancelled_qty += item.qty;
      } else {
        entry.total_qty += item.qty;
        if (row.payment_status === 'verified') entry.verified_qty += item.qty;
        else if (row.payment_status === 'awaiting') entry.awaiting_qty += item.qty;
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.product_name.localeCompare(b.product_name, 'vi'));
}

export async function getOrderCountByBatch(db: D1Database, batchId: string): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) as c FROM orders WHERE batch_id = ?`)
    .bind(batchId)
    .first<{ c: number }>();
  return row?.c ?? 0;
}
