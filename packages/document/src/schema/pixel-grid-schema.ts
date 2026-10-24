/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '../model/limits.constants';

const cell = z.number().int().min(MIN_SPRITE_SIZE).max(MAX_SPRITE_SIZE);

const pixelGridSchema = z.strictObject({ width: cell, height: cell });

export { pixelGridSchema };
