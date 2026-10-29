/* @layer core @kind constants */
const ORGANISE_LIMITS = {
  idMax: 128,
  tagMax: 40,
  tagsPerAsset: 32,
  nameMax: 60,
  queryMax: 300,
  collectionsMax: 64,
  smartMax: 64,
  assetsPerCollection: 5000,
  pinnedMax: 1000,
  taggedMax: 5000,
} as const;

const CONTROL_PATTERN = /\p{Cc}/u;

export { CONTROL_PATTERN, ORGANISE_LIMITS };
