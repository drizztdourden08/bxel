/* @layer core @kind logic */
import type { Tileset } from '../../model/tilemap.type';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { freeName } from '../layer/free-name';
import { TILE_NAME_STEM } from './tile.constants';

const tileSpriteName = (requested: string | undefined, taken: readonly string[], tileset: Tileset, key: number): string => {
  if (requested === undefined) return freeName(taken, `${tileset.name.slice(0, TILE_NAME_STEM)} ${key}`);
  const name = checkName(requested);
  assertNameFree(taken, name);
  return name;
};

export { tileSpriteName };
