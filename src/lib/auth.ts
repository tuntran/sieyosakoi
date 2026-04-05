// PBKDF2 auth helpers — Web Crypto API only (no bcrypt; CF Workers CPU limit)

const ITERATIONS = 100_000;
const HASH_ALG = 'SHA-256';
const BITS = 256;

/** Hash a password. Returns "pbkdf2:100000:<saltHex>:<hashHex>" */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: HASH_ALG },
    key, BITS
  );
  const saltHex = Buffer.from(salt).toString('hex');
  const hashHex = Buffer.from(hash).toString('hex');
  return `pbkdf2:${ITERATIONS}:${saltHex}:${hashHex}`;
}

/** Verify a password against a stored hash string */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1]!, 10);
  const salt = Buffer.from(parts[2]!, 'hex');
  const expectedHashHex = parts[3]!;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: HASH_ALG },
    key, BITS
  );
  const actualHashHex = Buffer.from(hash).toString('hex');

  // Constant-time compare (same length hex strings)
  if (actualHashHex.length !== expectedHashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < actualHashHex.length; i++) {
    diff |= actualHashHex.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  return diff === 0;
}

/** Create a new session in KV; returns the session token (UUID) */
export async function createSession(kv: KVNamespace): Promise<string> {
  const token = crypto.randomUUID();
  await kv.put(`session:${token}`, 'admin', { expirationTtl: 604800 }); // 7 days
  return token;
}

/** Validate a session token; returns true if valid */
export async function validateSession(kv: KVNamespace, token: string): Promise<boolean> {
  const val = await kv.get(`session:${token}`);
  return val === 'admin';
}

/** Delete a session from KV */
export async function deleteSession(kv: KVNamespace, token: string): Promise<void> {
  await kv.delete(`session:${token}`);
}
