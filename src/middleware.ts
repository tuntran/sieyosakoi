import { env } from 'cloudflare:workers';
import { defineMiddleware } from 'astro:middleware';
import { validateSession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Guard all /admin/* except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = context.cookies.get('session')?.value;
    const kv = env.KV;
    const valid = token ? await validateSession(kv, token) : false;
    if (!valid) return context.redirect('/admin/login');
  }

  const response = await next();

  // Prevent caching on all admin pages so data is always fresh
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return response;
});
