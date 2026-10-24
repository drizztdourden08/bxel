/* @layer core @kind constants */
const LISTED_KINDS = ['bxel', 'image', 'palette', 'sheet_json', 'other'] as const;

const DEFAULT_LISTED_KINDS = ['bxel', 'image', 'palette', 'sheet_json'] as const;

const KIND_OF_EXTENSION: Readonly<Record<string, (typeof LISTED_KINDS)[number]>> = {
  bxel: 'bxel',
  png: 'image',
  apng: 'image',
  gif: 'image',
  gpl: 'palette',
  pal: 'palette',
  hex: 'palette',
  json: 'sheet_json',
};

export { DEFAULT_LISTED_KINDS, KIND_OF_EXTENSION, LISTED_KINDS };
