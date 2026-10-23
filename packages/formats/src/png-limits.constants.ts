/* @layer core @kind constants */

const PNG_LIMITS = {
  IMPORT_MAX_SIDE: 4096,
  THUMBNAIL_MAX_SIDE: 256,
  UPSCALE_MAX_FACTOR: 16,
  PALETTE_MAX_ENTRIES: 256,
  CRITICAL_BIT: 0x20,
} as const;

export { PNG_LIMITS };
