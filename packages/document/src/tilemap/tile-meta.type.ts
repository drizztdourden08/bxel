/* @layer core @kind types */
import type { Tile } from '../model/tilemap.type';

type TileMeta = Pick<Tile, 'type' | 'probability' | 'turns' | 'data'>;

export type { TileMeta };
