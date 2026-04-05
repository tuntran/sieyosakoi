#!/usr/bin/env node
// Generate PBKDF2 password hash for admin KV seeding
// Usage: node scripts/generate-admin-hash.mjs <password>
// Output: pbkdf2:100000:<saltHex>:<hashHex>

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/generate-admin-hash.mjs <password>');
  process.exit(1);
}

const encoder = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));

const keyMaterial = await crypto.subtle.importKey(
  'raw',
  encoder.encode(password),
  'PBKDF2',
  false,
  ['deriveBits']
);

const hash = await crypto.subtle.deriveBits(
  { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
  keyMaterial,
  256
);

const saltHex = Buffer.from(salt).toString('hex');
const hashHex = Buffer.from(hash).toString('hex');
console.log(`pbkdf2:100000:${saltHex}:${hashHex}`);
