// R2 image URL + upload helpers

/** Build a public image URL served via the /img proxy endpoint */
export function imgUrl(key: string | null | undefined): string {
  if (!key) return '/img/placeholder.webp';
  // Already a full path (starts with /img/) — return as-is
  if (key.startsWith('/img/')) return key;
  return `/img/${key}`;
}

/** Upload a File/Blob to R2 and return the stored key */
export async function uploadImage(
  r2: R2Bucket,
  key: string,
  data: File | Blob | ReadableStream | ArrayBuffer,
  contentType = 'image/webp'
): Promise<string> {
  await r2.put(key, data, { httpMetadata: { contentType } });
  return key;
}
