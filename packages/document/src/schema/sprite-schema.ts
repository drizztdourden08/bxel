/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { BankId, CelId, FrameId, LayerId, SliceId, SpriteId, TagId } from '../model/ids.type';
import {
  MAX_DURATION_MS,
  MAX_SAVED_SELECTIONS,
  MAX_SPRITE_SIZE,
  MIN_DURATION_MS,
  MIN_SPRITE_SIZE,
} from '../model/limits.constants';
import { brandedIdSchema } from './branded-id-schema';
import { createdSchema } from './created-schema';
import { guidesSchema } from './guides-schema';
import { spriteSymmetrySchema } from './sprite-symmetry-schema';
import { savedSelectionSchema } from './saved-selection-schema';
import { nameSchema } from './name-schema';
import { pivotSchema } from './pivot-schema';
import { pixelGridSchema } from './pixel-grid-schema';
import { platformIdSchema } from './platform-id-schema';
import { rectSchema } from './rect-schema';
import { tagColourSchema } from './tag-colour-schema';
import { LAYER_KINDS } from '../model/layer-lock.constants';
import { upgradeLayerJson } from '../native/migrations/upgrade-layer-json';
import { layerLockSchema } from './layer-lock-schema';
import { layerReferenceSchema } from './layer-reference-schema';
import { opacitySchema } from './opacity-schema';

const frameId = brandedIdSchema<FrameId>(ID_PREFIX.frame);
const celId = brandedIdSchema<CelId>(ID_PREFIX.cel);
const sizeSchema = z.number().int().min(MIN_SPRITE_SIZE).max(MAX_SPRITE_SIZE);

const layerId = brandedIdSchema<LayerId>(ID_PREFIX.layer);

const layerSchema = z.preprocess(
  upgradeLayerJson,
  z.object({
    id: layerId,
    name: nameSchema,
    visible: z.boolean(),
    lock: layerLockSchema,
    kind: z.enum(LAYER_KINDS).optional(),
    parentId: layerId.optional(),
    viewOpacity: opacitySchema.optional(),
    clip: z.boolean().optional(),
    colour: tagColourSchema.optional(),
    exported: z.boolean().optional(),
    reference: layerReferenceSchema.optional(),
    cels: z.record(z.string(), celId),
  }),
);

const frameSchema = z.object({
  id: frameId,
  durationMs: z.number().int().min(MIN_DURATION_MS).max(MAX_DURATION_MS),
});

const tagSchema = z.object({
  id: brandedIdSchema<TagId>(ID_PREFIX.tag),
  name: nameSchema,
  from: frameId,
  to: frameId,
  direction: z.enum(['forward', 'reverse', 'pingpong']),
  repeat: z.number().int().min(0),
  colour: tagColourSchema.optional(),
});

const sliceSchema = z.object({
  id: brandedIdSchema<SliceId>(ID_PREFIX.slice),
  name: nameSchema,
  rect: rectSchema,
  pivot: pivotSchema.nullable(),
  center: rectSchema.nullable(),
  colour: tagColourSchema.optional(),
});

const spriteShellSchema = z.object({
  id: brandedIdSchema<SpriteId>(ID_PREFIX.sprite),
  name: nameSchema,
  created: createdSchema.optional(),
  role: z.enum(['sprite', 'tile', 'frame']),
  bankId: brandedIdSchema<BankId>(ID_PREFIX.bank),
  width: sizeSchema,
  height: sizeSchema,
  pivot: pivotSchema,
  platformId: platformIdSchema.optional(),
  platformStrict: z.boolean().optional(),
  pixelGrid: pixelGridSchema.optional(),
  guides: guidesSchema.optional(),
  selections: z.array(savedSelectionSchema).max(MAX_SAVED_SELECTIONS).optional(),
  symmetry: spriteSymmetrySchema.optional(),
  layers: z.array(layerSchema),
  frames: z.array(frameSchema),
  tags: z.array(tagSchema),
  slices: z.array(sliceSchema),
  celIds: z.array(celId),
});

export { spriteShellSchema };
