/* @layer core @kind logic */
import type { Level } from '../catalogue/catalogue.type';
import { LEVEL_RANK } from '../catalogue/level.constants';

const atLeast = (level: Level, needed: Level): boolean => LEVEL_RANK[level] >= LEVEL_RANK[needed];

export { atLeast };
