/* @layer core @kind logic */
import type { Level } from '../catalogue/catalogue.type';
import { LEVEL_RANK } from '../catalogue/level.constants';

const lowerLevel = (first: Level, second: Level): Level => (LEVEL_RANK[first] <= LEVEL_RANK[second] ? first : second);

export { lowerLevel };
