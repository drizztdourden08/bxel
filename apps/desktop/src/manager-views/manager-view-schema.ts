/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { z } from 'zod';
import { ATLAS_LIMITS, NO_FILTER, SORT_KEYS, ZOOM } from '../sheet-manager/manager.constants';
import { MANAGER_DEFAULTS } from '../stores/manager-store.constants';

const whole = (max: number, fallback: number) => z.number().int().min(0).max(max).catch(fallback);

const filterSchema = z
  .object({
    animated: z.boolean().catch(NO_FILTER.animated),
    unplaced: z.boolean().catch(NO_FILTER.unplaced),
    size: z.string().nullable().catch(NO_FILTER.size),
    identical: z.enum(['off', 'same', 'flips']).catch(NO_FILTER.identical),
    tag: z.string().nullable().catch(NO_FILTER.tag),
    bank: z.string().nullable().catch(NO_FILTER.bank),
  })
  .catch(NO_FILTER);

const atlasSchema = z
  .object({
    extrude: whole(ATLAS_LIMITS.extrudeMax, MANAGER_DEFAULTS.atlas.extrude),
    pivots: z.boolean().catch(MANAGER_DEFAULTS.atlas.pivots),
    zoom: z.number().int().min(1).max(ATLAS_LIMITS.zoomMax).catch(MANAGER_DEFAULTS.atlas.zoom),
    bounds: z.boolean().catch(MANAGER_DEFAULTS.atlas.bounds),
    trim: z.boolean().catch(MANAGER_DEFAULTS.atlas.trim),
    powerOfTwo: z.boolean().catch(MANAGER_DEFAULTS.atlas.powerOfTwo),
    rotate: z.boolean().catch(MANAGER_DEFAULTS.atlas.rotate),
    pageSide: whole(ATLAS_LIMITS.pageMax, MANAGER_DEFAULTS.atlas.pageSide),
    page: whole(ATLAS_LIMITS.pageMax, MANAGER_DEFAULTS.atlas.page),
  })
  .catch(MANAGER_DEFAULTS.atlas);

const selectionSchema = z.object({ name: z.string(), ids: z.array(z.string().transform((id) => id as SpriteId)) });

const managerViewSchema = z.object({
  tab: z.enum(['sprites', 'atlas']).catch(MANAGER_DEFAULTS.tab),
  view: z.enum(['grid', 'list']).catch(MANAGER_DEFAULTS.view),
  zoom: z.number().min(ZOOM.min).max(ZOOM.max).catch(MANAGER_DEFAULTS.zoom),
  query: z.string().catch(MANAGER_DEFAULTS.query),
  filter: filterSchema,
  sortKey: z.enum(SORT_KEYS).catch(MANAGER_DEFAULTS.sortKey),
  sortDown: z.boolean().catch(MANAGER_DEFAULTS.sortDown),
  atlas: atlasSchema,
  collapsed: z.array(z.string()).catch([]),
  selections: z.array(selectionSchema).catch([]),
});

export { managerViewSchema };
