/* @layer core @kind config */
const MIMETYPE = 'application/vnd.bxel+zip';
const FORMAT_NAME = 'bxel';
const FORMAT_VERSION = 1;
const MIN_READER_VERSION = 1;
const WRITER = { app: 'Bxel', version: '0.1.0' } as const;
const ENTRY = {
  mimetype: 'mimetype',
  manifest: 'manifest.json',
  document: 'document.json',
  preview: 'preview.png',
} as const;
const CEL_DIR = 'cels/';
const CEL_EXTENSION = '.idx';
const TILEMAP_DIR = 'tilemaps/';
const TILEMAP_EXTENSION = '.u32';
const CELL_BYTES = 4;
const MEGABYTE = 1024 * 1024;
const MAX_FILE_BYTES = 512 * MEGABYTE;
const MAX_ENTRY_BYTES = 64 * MEGABYTE;
const MAX_TOTAL_BYTES = 1024 * MEGABYTE;
const DEFLATE_LEVEL = 6;
const STORED_LEVEL = 0;
const ZIP_MTIME = new Date(1980, 0, 1, 0, 0, 0);
const ZIP_SIGNATURE = [0x50, 0x4b, 0x03, 0x04] as const;
const MAX_REPORTED_ISSUES = 20;

export {
  CELL_BYTES,
  CEL_DIR,
  CEL_EXTENSION,
  DEFLATE_LEVEL,
  ENTRY,
  FORMAT_NAME,
  FORMAT_VERSION,
  MAX_ENTRY_BYTES,
  MAX_FILE_BYTES,
  MAX_REPORTED_ISSUES,
  MAX_TOTAL_BYTES,
  MIMETYPE,
  MIN_READER_VERSION,
  STORED_LEVEL,
  TILEMAP_DIR,
  TILEMAP_EXTENSION,
  WRITER,
  ZIP_MTIME,
  ZIP_SIGNATURE,
};
