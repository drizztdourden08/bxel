/* @layer core @kind logic */
import { z } from 'zod';

const layerLockSchema = z.object({ pixels: z.boolean(), transparency: z.boolean(), position: z.boolean() });

export { layerLockSchema };
