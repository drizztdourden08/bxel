/* @layer core @kind types */
import type { z } from 'zod';
import type { pixelsPatchSchema } from './pixels-patch-schema';
import type { projectCreateSchema } from './project-create-schema';
import type { projectUpdateSchema } from './project-update-schema';
import type { spriteCreateSchema } from './sprite-create-schema';
import type { spriteUpdateSchema } from './sprite-update-schema';

type ProjectCreateOptions = z.output<typeof projectCreateSchema>;
type ProjectUpdateOptions = z.output<typeof projectUpdateSchema>;
type SpriteCreateOptions = z.output<typeof spriteCreateSchema>;
type SpriteUpdateOptions = z.output<typeof spriteUpdateSchema>;
type PixelsPatchOptions = z.output<typeof pixelsPatchSchema>;

export type { PixelsPatchOptions, ProjectCreateOptions, ProjectUpdateOptions, SpriteCreateOptions, SpriteUpdateOptions };
