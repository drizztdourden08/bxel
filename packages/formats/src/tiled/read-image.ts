/* @layer core @kind logic */
import { numberOf } from './number-of';
import type { Rec } from './rec.type';
import type { TiledImage } from './tiled.type';

const readImage = (record: Rec): TiledImage | null => {
  const source = record['image'];
  if (typeof source !== 'string' || source === '') return null;
  const trans = record['transparentcolor'];
  return {
    source,
    width: numberOf(record['imagewidth'], 0),
    height: numberOf(record['imageheight'], 0),
    transparent: typeof trans === 'string' && trans !== '' ? trans : null,
  };
};

export { readImage };
