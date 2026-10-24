/* @layer core @kind types */
import type { z } from 'zod';
import type { layerAddSchema } from './layer-add-schema';
import type { layerDeleteSchema } from './layer-delete-schema';
import type { layerDuplicateSchema } from './layer-duplicate-schema';
import type { layerFlattenSchema } from './layer-flatten-schema';
import type { layerMergeSchema } from './layer-merge-schema';
import type { layerRefSchema } from './layer-ref-schema';
import type { layerReorderSchema } from './layer-reorder-schema';
import type { layerUpdateSchema } from './layer-update-schema';
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
type LayerRef = z.output<typeof layerRefSchema>;
type LayerAddOptions = z.output<typeof layerAddSchema>;
type LayerUpdateOptions = z.output<typeof layerUpdateSchema>;
type LayerDeleteOptions = z.output<typeof layerDeleteSchema>;
type LayerReorderOptions = z.output<typeof layerReorderSchema>;
type LayerDuplicateOptions = z.output<typeof layerDuplicateSchema>;
type LayerMergeOptions = z.output<typeof layerMergeSchema>;
type LayerFlattenOptions = z.output<typeof layerFlattenSchema>;

export type {
  LayerAddOptions,
  LayerDeleteOptions,
  LayerDuplicateOptions,
  LayerFlattenOptions,
  LayerMergeOptions,
  LayerRef,
  LayerReorderOptions,
  LayerUpdateOptions,
  PixelsPatchOptions,
  ProjectCreateOptions,
  ProjectUpdateOptions,
  SpriteCreateOptions,
  SpriteUpdateOptions,
};
