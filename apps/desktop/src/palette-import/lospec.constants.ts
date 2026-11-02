/* @layer renderer-app @kind constants */
const LOSPEC_HOST = 'lospec.com';

const LOSPEC_PAGE = /^(?:https?:\/\/)?(?:www\.)?lospec\.com\/palette-list\/([a-z0-9][a-z0-9-]*)(?:\.json)?\/?(?:[?#].*)?$/i;

const LOSPEC_LINK = /^lospec-palette:\/\/([a-z0-9][a-z0-9-]*)\/?$/i;

const LOSPEC_BARE = /^[a-z0-9][a-z0-9-]{1,63}$/i;

const LOSPEC_MAX_BYTES = 256 * 1024;

const LOSPEC_TYPES: readonly string[] = ['application/json'];

const LOSPEC_DELAY_MS = 600;

const lospecUrl = (slug: string): string => `https://${LOSPEC_HOST}/palette-list/${slug}.json`;

const LOSPEC_TEXT = {
  loading: 'Fetching the palette from Lospec...',
  offline: 'Lospec palettes cannot be fetched here.',
  failed: (slug: string): string => `Lospec did not give the palette "${slug}". Check the name and the connection.`,
  unreadable: 'That Lospec answer holds no colours Bxel can read.',
  by: (author: string): string => `by ${author}`,
} as const;

export { LOSPEC_BARE, LOSPEC_DELAY_MS, LOSPEC_LINK, LOSPEC_MAX_BYTES, LOSPEC_PAGE, LOSPEC_TEXT, LOSPEC_TYPES, lospecUrl };
