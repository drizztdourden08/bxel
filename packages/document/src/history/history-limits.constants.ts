/* @layer core @kind config */
const DEFAULT_HISTORY_LIMITS = { maxBytes: 128 * 1024 * 1024, maxEntries: 1000 } as const;
const REMAP_OP_BYTES = 512;
const ENTITY_OP_BYTES = 64;

export { DEFAULT_HISTORY_LIMITS, ENTITY_OP_BYTES, REMAP_OP_BYTES };
