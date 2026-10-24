/* @layer core @kind logic */
import { z } from 'zod';
import { tilemapShellSchema } from './tilemap-schema';

const tilemapFileSchema = z.object({ tilemap: tilemapShellSchema });

export { tilemapFileSchema };
