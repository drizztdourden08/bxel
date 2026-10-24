/* @layer core @kind logic */
import { z } from 'zod';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilesetDeleteSchema = z.strictObject({ tileset: tilesetRefSchema });

export { tilesetDeleteSchema };
