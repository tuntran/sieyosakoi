import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { getOrderById } from '../../lib/db';

// Proxy VietQR image with Content-Disposition: attachment so mobile can save it
export const GET: APIRoute = async ({ url }) => {
  const orderId = url.searchParams.get('order');
  if (!orderId) return new Response('Missing order', { status: 400 });

  const order = await getOrderById(env.DB, orderId);
  if (!order) return new Response('Order not found', { status: 404 });

  const addInfo = encodeURIComponent(`${order.id} ${order.phone}`);
  const accountName = encodeURIComponent('Vu Khanh Chi');
  const qrUrl = `https://img.vietqr.io/image/TCB-19040070626015-compact2.png?amount=${order.total}&addInfo=${addInfo}&accountName=${accountName}`;

  const resp = await fetch(qrUrl);
  if (!resp.ok) return new Response('QR fetch failed', { status: 502 });

  return new Response(resp.body, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="qr-${order.id}.png"`,
      'Cache-Control': 'private, max-age=60',
    },
  });
};
