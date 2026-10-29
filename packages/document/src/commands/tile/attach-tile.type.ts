/* @layer core @kind types */
import type { Tile } from '../../model/tilemap.type';

type TileKeep = Pick<Tile, 'shapes' | 'type' | 'probability' | 'turns' | 'data'>;

export type { TileKeep };
