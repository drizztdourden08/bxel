/* @layer core @kind logic */
import { DEFAULT_PIECE_PATTERN, MAX_PATTERN_LENGTH } from '@bxel/document';
import { z } from 'zod';

const pieceFields = {
  pattern: z.string().min(1).max(MAX_PATTERN_LENGTH).default(DEFAULT_PIECE_PATTERN),
  start: z.number().int().min(0).max(99999).default(1),
  keep: z.boolean().default(false),
};

export { pieceFields };
