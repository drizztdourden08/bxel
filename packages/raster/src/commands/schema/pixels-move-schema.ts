/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { maskSchema } from './mask-schema';
import { pointSchema } from './point-schema';
import { skipZeroSchema } from './skip-zero-schema';

const pixelsMoveSchema = z.strictObject({ offset: pointSchema, skipZero: skipZeroSchema, mask: maskSchema, allUses: allUsesSchema });

export { pixelsMoveSchema };
