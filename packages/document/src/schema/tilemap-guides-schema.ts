/* @layer core @kind logic */
import { z } from 'zod';
import { assetGuidesSchema } from './asset-guides-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const tilemapGuidesSchema = z.strictObject({ tilemap: tilemapRefSchema, guides: assetGuidesSchema });

export { tilemapGuidesSchema };
