import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { deleteSession } from '../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get('session')?.value;
  if (token) {
    await deleteSession(env.KV, token);
  }
  cookies.delete('session', { path: '/' });
  return new Response(null, {
    status: 302,
    headers: { Location: '/admin/login' },
  });
};
