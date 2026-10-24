/* @layer core @kind logic */
import { z } from 'zod';
import { pieceFields } from './piece-fields';

const spriteSplitSchema = z.strictObject(pieceFields);

export { spriteSplitSchema };
