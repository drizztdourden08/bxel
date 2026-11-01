/* @layer core @kind constants */
import { z } from 'zod';

const UI_STATE_VALUES = ['shown', 'disabled', 'hidden'] as const;

const UI_VIEW_SCHEMA = z
  .strictObject({
    workspace: z.string().describe('The kind of file on screen, which picks the layout: none, sprite, animation, palette, sheet, tileset, tilemap or image.'),
    widgets: z.array(z.strictObject({ id: z.string(), state: z.enum(UI_STATE_VALUES), reason: z.string().nullable() })).describe('Each widget and whether the rules show it for this context.'),
    toolbars: z.array(z.strictObject({ id: z.string(), state: z.enum(UI_STATE_VALUES) })),
    kindMenu: z.strictObject({ kind: z.string(), state: z.enum(UI_STATE_VALUES) }).nullable().describe('The menu of the open kind of file, or null when nothing is open.'),
  })
  .describe('What the owner can see in the layout for this context, from the same rules the window uses.');

export { UI_VIEW_SCHEMA };
