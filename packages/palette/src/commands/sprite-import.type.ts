/* @layer core @kind types */
import type { z } from 'zod';
import type { spriteImportSchema } from './sprite-import-schema';

type SpriteImportOptions = z.output<typeof spriteImportSchema>;

type ImportBank = SpriteImportOptions['bank'];

type ImportImage = SpriteImportOptions['image'];

type ImportMapping = SpriteImportOptions['mapping'];

export type { ImportBank, ImportImage, ImportMapping };
