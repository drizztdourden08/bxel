/* @layer core @kind types */
import type { z } from 'zod';
import type { animFrameRefSchema } from './anim-frame-ref-schema';
import type { animTagRefSchema } from './anim-tag-ref-schema';
import type { animStripGridSchema } from './anim-strip-grid-schema';
import type { animClipSchema } from './anim-clip-schema';
import type { animSourceSchema } from './anim-source-schema';
import type { animationCreateSchema } from './animation-create-schema';
import type { animationUpdateSchema } from './animation-update-schema';
import type { animationDeleteSchema } from './animation-delete-schema';
import type { animationDuplicateSchema } from './animation-duplicate-schema';
import type { animationFrameAddSchema } from './animation-frame-add-schema';
import type { animationFrameUpdateSchema } from './animation-frame-update-schema';
import type { animationFrameDeleteSchema } from './animation-frame-delete-schema';
import type { animationFrameReorderSchema } from './animation-frame-reorder-schema';
import type { animationFramePickSchema } from './animation-frame-pick-schema';
import type { animationTagAddSchema } from './animation-tag-add-schema';
import type { animationTagUpdateSchema } from './animation-tag-update-schema';
import type { animationTagDeleteSchema } from './animation-tag-delete-schema';
import type { animationDirectionsSchema } from './animation-directions-schema';
import type { animationSplitSchema } from './animation-split-schema';
import type { tileAnimationSchema } from './tile-animation-schema';

type AnimFrameRef = z.output<typeof animFrameRefSchema>;
type AnimTagRef = z.output<typeof animTagRefSchema>;
type AnimStripGrid = z.output<typeof animStripGridSchema>;
type AnimClip = z.output<typeof animClipSchema>;
type AnimSourceOptions = z.output<typeof animSourceSchema>;
type AnimationCreateOptions = z.output<typeof animationCreateSchema>;
type AnimationUpdateOptions = z.output<typeof animationUpdateSchema>;
type AnimationDeleteOptions = z.output<typeof animationDeleteSchema>;
type AnimationDuplicateOptions = z.output<typeof animationDuplicateSchema>;
type AnimationFrameAddOptions = z.output<typeof animationFrameAddSchema>;
type AnimationFrameUpdateOptions = z.output<typeof animationFrameUpdateSchema>;
type AnimationFrameDeleteOptions = z.output<typeof animationFrameDeleteSchema>;
type AnimationFrameReorderOptions = z.output<typeof animationFrameReorderSchema>;
type AnimationFramePickOptions = z.output<typeof animationFramePickSchema>;
type AnimationTagAddOptions = z.output<typeof animationTagAddSchema>;
type AnimationTagUpdateOptions = z.output<typeof animationTagUpdateSchema>;
type AnimationTagDeleteOptions = z.output<typeof animationTagDeleteSchema>;
type AnimationDirectionsOptions = z.output<typeof animationDirectionsSchema>;
type AnimationSplitOptions = z.output<typeof animationSplitSchema>;
type TileAnimationOptions = z.output<typeof tileAnimationSchema>;

export type {
  AnimFrameRef,
  AnimTagRef,
  AnimStripGrid,
  AnimClip,
  AnimSourceOptions,
  AnimationCreateOptions,
  AnimationUpdateOptions,
  AnimationDeleteOptions,
  AnimationDuplicateOptions,
  AnimationFrameAddOptions,
  AnimationFrameUpdateOptions,
  AnimationFrameDeleteOptions,
  AnimationFrameReorderOptions,
  AnimationFramePickOptions,
  AnimationTagAddOptions,
  AnimationTagUpdateOptions,
  AnimationTagDeleteOptions,
  AnimationDirectionsOptions,
  AnimationSplitOptions,
  TileAnimationOptions,
};
