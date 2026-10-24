/* @layer core @kind logic */
import {
  MAX_BANK_CAP,
  MAX_DURATION_MS,
  MAX_SPRITE_SIZE,
  MIN_BANK_CAP,
  MIN_DURATION_MS,
  MIN_SPRITE_SIZE,
  PLATFORM_ID_PATTERN,
} from '@bxel/document';
import { z } from 'zod';
import { folderIdSchema } from '../ids/folder-id-schema';
import { locationPathSchema } from '../project-document/location-path-schema';

const pixelSizeSchema = z.strictObject({
  width: z.number().int().min(MIN_SPRITE_SIZE).max(MAX_SPRITE_SIZE),
  height: z.number().int().min(MIN_SPRITE_SIZE).max(MAX_SPRITE_SIZE),
});

const paletteDefaultSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('preset'), presetId: z.string().min(1).max(64) }),
  z.strictObject({ kind: z.literal('file'), folderId: folderIdSchema, path: locationPathSchema(false) }),
]);

const defaultsSchema = z.strictObject({
  size: pixelSizeSchema.optional(),
  colorLimit: z.number().int().min(MIN_BANK_CAP).max(MAX_BANK_CAP).optional(),
  palette: paletteDefaultSchema.optional(),
  platformId: z.string().regex(PLATFORM_ID_PATTERN).nullable().optional(),
  platformStrict: z.boolean().optional(),
  transparent: z.boolean().optional(),
  frameDurationMs: z.number().int().min(MIN_DURATION_MS).max(MAX_DURATION_MS).optional(),
  pixelGrid: pixelSizeSchema.optional(),
});

export { defaultsSchema };
