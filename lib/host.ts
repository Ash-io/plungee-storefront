export function slugFromHost(host: string): string {
  const h = (host || '').split(':')[0];
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN || '';
  if (root && h.endsWith(root)) {
    const sub = h.slice(0, h.length - root.length).replace(/\.$/, '');
    if (sub && sub !== 'www') return sub;
  }
  return process.env.DEV_STORE_SLUG || '';
}
