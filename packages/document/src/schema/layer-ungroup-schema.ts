/* @layer core @kind logic */
import { z } from 'zod';
import { layerRefSchema } from './layer-ref-schema';

const layerUngroupSchema = z.strictObject({ layer: layerRefSchema.describe('The group to take apart. Its children stay where they are.') });

export { layerUngroupSchema };
