/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { turnDirectionSchema } from './turn-direction-schema';

const spriteTurnSchema = z.strictObject({ direction: turnDirectionSchema, allUses: allUsesSchema });

export { spriteTurnSchema };
