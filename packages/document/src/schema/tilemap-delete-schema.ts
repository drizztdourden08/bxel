/* @layer core @kind logic */
import { z } from 'zod';
import { tilemapRefSchema } from './tilemap-ref-schema';

const tilemapDeleteSchema = z.strictObject({ tilemap: tilemapRefSchema });

export { tilemapDeleteSchema };
