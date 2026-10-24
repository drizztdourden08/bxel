/* @layer core @kind logic */
import { z } from 'zod';
import { orientRequestSchema } from './orient-request-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const tilemapOrientSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  orientation: orientRequestSchema,
});

export { tilemapOrientSchema };
