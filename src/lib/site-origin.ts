/** Public origin used until the business domain is connected and verified. */
export const DEFAULT_SITE_ORIGIN = 'https://haviss-metrology.woodsydog32768.chatgpt.site';

/** Accept only an absolute web origin; fall back safely if configuration is missing or invalid. */
export function resolveSiteOrigin(value?: string): string {
  if (!value?.trim()) return DEFAULT_SITE_ORIGIN;
  try {
    const url = new URL(value.trim());
    if ((url.protocol !== 'https:' && url.protocol !== 'http:') || url.username || url.password) return DEFAULT_SITE_ORIGIN;
    return url.origin;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
}
