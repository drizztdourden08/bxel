/* @layer core @kind logic */
import { z } from 'zod';
import { turnDirectionSchema } from './turn-direction-schema';

const spriteTurnSchema = z.strictObject({ direction: turnDirectionSchema });

export { spriteTurnSchema };
