/* @layer core @kind constants */
import { z } from 'zod';
import { BANK_ID_SCHEMA, SPRITE_ID_SCHEMA } from './ids.constants';

const SPRITES_FIELD = z.array(SPRITE_ID_SCHEMA).min(1).max(512).optional().describe('Sprite ids from get_document. Without them the sprites picked in the sheet manager are used.');

const CELLS_FIELDS = {
  by: z.enum(['count', 'size']).optional().describe('count cuts by the number of columns and rows; size cuts cells of a width and height.'),
  columns: z.number().int().min(1).max(256).optional(),
  rows: z.number().int().min(1).max(256).optional(),
  cellWidth: z.number().int().min(1).max(4096).optional(),
  cellHeight: z.number().int().min(1).max(4096).optional(),
};

const RENAME_FIELDS = {
  sprites: SPRITES_FIELD,
  pattern: z.string().min(1).max(200).optional().describe('The name pattern. {name} is the old name after find and replace, {n} counts from start.'),
  find: z.string().max(200).optional().describe('Text to find in each old name before the pattern is applied.'),
  replace: z.string().max(200).optional().describe('Text that takes the place of find.'),
  start: z.number().int().min(0).max(100000).optional().describe('The first number of {n}.'),
};

const FOLDER_FIELDS = { sprites: SPRITES_FIELD, folder: z.string().max(200).describe('The folder path, such as enemies/bats. An empty text moves the sprites out of any folder.') };

const BANK_FIELDS = { sprites: SPRITES_FIELD, bankId: BANK_ID_SCHEMA };

const SLICE_FIELDS = {
  sprites: SPRITES_FIELD,
  by: z.enum(['count', 'size', 'islands']).optional().describe('count cuts columns and rows, size cuts cells, islands cuts the separate shapes.'),
  columns: CELLS_FIELDS.columns,
  rows: CELLS_FIELDS.rows,
  cellWidth: CELLS_FIELDS.cellWidth,
  cellHeight: CELLS_FIELDS.cellHeight,
  minSize: z.number().int().min(1).max(4096).optional().describe('islands: the smallest shape kept, in pixels across.'),
  merge: z.number().int().min(0).max(64).optional().describe('islands: shapes closer than this many pixels become one piece.'),
  pattern: z.string().min(1).max(200).optional().describe('The name pattern of the pieces.'),
  start: z.number().int().min(0).max(100000).optional(),
  keep: z.boolean().optional().describe('Keep the source sprites.'),
  existing: z.enum(['replace', 'keep', 'skip']).optional().describe('What to do when a piece name is taken: replace the old sprite, keep both with a new name, or skip the piece.'),
  skipEmpty: z.boolean().optional().describe('Leave out the cells with no pixels.'),
};

const STRIP_FIELDS = {
  sprite: SPRITE_ID_SCHEMA.optional().describe('The strip sprite. Without it the one picked sprite is used.'),
  name: z.string().max(200).optional().describe('The name of the new animation. Without it the sprite name is used.'),
  ...CELLS_FIELDS,
  result: z.enum(['cells', 'cut']).optional().describe('cells keeps the frames as cells of the strip; cut makes a sprite of each cell.'),
  durationMs: z.number().int().min(10).max(60000).optional(),
  swap: z.boolean().optional().describe('Put the animation on the sheet in the place of the strip sprite.'),
};

const RECT_SCHEMA = z.strictObject({ x: z.number().int(), y: z.number().int(), width: z.number().int().min(0), height: z.number().int().min(0) });

const PLAN_INPUT_SCHEMA = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('rename'), copy: z.boolean().optional().describe('Plan the names of copies instead of renames.'), ...RENAME_FIELDS }),
  z.strictObject({ kind: z.literal('folder'), ...FOLDER_FIELDS }),
  z.strictObject({ kind: z.literal('slice'), ...SLICE_FIELDS }),
  z.strictObject({ kind: z.literal('strip'), ...STRIP_FIELDS }),
]);

const PLAN_RESULT_SCHEMA = z.strictObject({
  kind: z.enum(['rename', 'folder', 'slice', 'strip']),
  ok: z.boolean().describe('True when the command would run.'),
  names: z
    .array(z.strictObject({ id: z.string().nullable(), from: z.string().nullable(), to: z.string(), error: z.string().nullable() }))
    .describe('The names the sprites would get. A slice lists the new pieces with a null id and from.'),
  rects: z.array(RECT_SCHEMA).describe('slice: the rectangles of the pieces cut from the first sprite. strip: the cells of the strip.'),
  grid: z.strictObject({ columns: z.number().int(), rows: z.number().int(), cellWidth: z.number().int(), cellHeight: z.number().int() }).nullable(),
  hint: z.strictObject({ cells: z.number().int(), columns: z.number().int(), rows: z.number().int() }).nullable().describe('strip: the cut the sprite looks made for, or null.'),
  error: z.string().nullable(),
});

export { BANK_FIELDS, FOLDER_FIELDS, PLAN_INPUT_SCHEMA, PLAN_RESULT_SCHEMA, RENAME_FIELDS, SLICE_FIELDS, STRIP_FIELDS };
