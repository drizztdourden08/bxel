/* @layer renderer-app @kind types */
import type { AtlasAnimation, AtlasItem, AtlasPlanned } from './manager.type';

type PlannedAtlas = Extract<AtlasPlanned, { ok: true }>;

type AtlasPage = { readonly items: AtlasItem[]; readonly animations: AtlasAnimation[] };

export type { AtlasPage, PlannedAtlas };
