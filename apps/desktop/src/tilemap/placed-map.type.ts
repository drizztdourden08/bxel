/* @layer renderer-app @kind types */
import type { CellFlags } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';
import type { MapTarget } from './tilemap.type';

type PlacedMap = { readonly target: MapTarget; readonly stamp: TileStamp; readonly flags: CellFlags };

export type { PlacedMap };
