/**
 * Appends an ImageKit URL transformation (e.g. "w-600,q-80") to a URL.
 * Non-ImageKit URLs are returned untouched.
 */
export function ik(url, transformation) {
  if (!url || !transformation) return url || '';
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith('ik.imagekit.io')) return url;
    u.searchParams.set('tr', transformation);
    return u.toString();
  } catch {
    return url;
  }
}
