/* @layer renderer-app @kind logic */
import { pickTile } from './pick-tile';
import { placeTiles } from './place-tiles';

const placeWithTile = (key: number): boolean => pickTile(key) && placeTiles();

export { placeWithTile };
