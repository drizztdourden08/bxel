/* @layer core @kind config */
const ASSET_BASE_VERSION = 2;
const ASSET_ANIMATED_VERSION = 3;
const ASSET_FORMAT_VERSION = 3;
const ASSET_MIN_READER_VERSION = ASSET_BASE_VERSION;
const ASSET_DOCUMENT_ENTRY = {
  sprite: 'sprite.json',
  animation: 'animation.json',
  sheet: 'sheet.json',
  palette: 'palette.json',
  tileset: 'tileset.json',
  tilemap: 'tilemap.json',
  project: 'project.json',
} as const;
const RECOVERED_PALETTE_NAME = 'Recovered palette';
const SCOPE_ARTWORK_ID = 'art_000000';
const MISSING_LINK_NOTICE = 'A linked file is missing. The file opens with the copy it keeps; Save writes the link again.';
const JSON_INDENT = 2;
const LEGACY_FILE_MESSAGE = 'This is an older Bxel file (.bxel). Open it as a project or split it into assets.';

export {
  ASSET_ANIMATED_VERSION,
  ASSET_BASE_VERSION,
  ASSET_DOCUMENT_ENTRY,
  ASSET_FORMAT_VERSION,
  ASSET_MIN_READER_VERSION,
  JSON_INDENT,
  LEGACY_FILE_MESSAGE,
  MISSING_LINK_NOTICE,
  RECOVERED_PALETTE_NAME,
  SCOPE_ARTWORK_ID,
};
