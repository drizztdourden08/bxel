/* @layer helper @kind constants */
const GUIDE_URI = 'bxel://guide';

const GUIDE_TEXT = [
  '# Bxel for assistants',
  '',
  'Bxel edits indexed pixel art. Every pixel holds a palette index, one byte, and index 0 of a transparent bank is see-through.',
  'Coordinates start at the top left. Pivots are doubled (x2, y2) so a pivot can sit between pixels.',
  '',
  '## The loop',
  '',
  '1. get_session pairs with Bxel and lists the commands and limits. If Bxel is not running, call start_bxel with window "headless" (no window) or "visible".',
  '2. list_documents, then get_document for the sprites, layers and frames. read_palette for the colors, read_pixels for a rectangle.',
  '3. preview_edits with your steps at the revision you read. Nothing changes.',
  '4. apply_edits with the same input. The batch lands whole as one undo step, or not at all.',
  '5. A STALE_REVISION error means the owner or another program moved the document: read again, rebuild, retry.',
  '',
  'Pixels travel as base64 of one byte per pixel, row by row. A read rectangle can be edited and written back as one pixels.patch step.',
  '',
  '## Recipes',
  '',
  '- Create a sprite: create_document with a name, a bank (name, cap, transparent, colors) and a sprite (name, width, height). save_document with a fileName gives it a file in the assistant folder.',
  '- Draw: read_pixels on the layer, change the bytes, then apply_edits with one pixels.patch step on that layer and frame.',
  '- Mirror: read_pixels the whole layer, reverse each row (or the row order for a vertical mirror), and write it back with pixels.patch.',
  '- Recolor: read_palette, then apply_edits with the palette command the session lists, or patch the pixels to another index.',
  '- Several sprites: one step can name up to 64 sprites in its targets; a batch holds up to 256 steps.',
  '- Export: export_document with format "png", a sprite source and a fileName. Exports stay off the recent files list.',
  '',
  '## Starting and stopping',
  '',
  'A headless Bxel has no window. show_window brings the window up for the owner. stop_bxel ends a headless Bxel this session started; with unsaved work pass unsaved "recover" so the owner finds it under Recovery.',
  'When this helper closes, a headless Bxel it started keeps unsaved work for recovery and quits.',
].join('\n');

export { GUIDE_TEXT, GUIDE_URI };
