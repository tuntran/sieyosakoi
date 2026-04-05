import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

// R2 image proxy — serves product images stored in R2 bucket
export const GET: APIRoute = async ({ params }) => {
  const key = params.key;

  // Prevent path traversal
  if (!key || key.includes('..')) {
    return new Response('Not found', { status: 404 });
  }

  const obj = await env.R2.get(key);
  if (!obj) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(obj.body as ReadableStream, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType ?? 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
