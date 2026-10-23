/* @layer core @kind logic */
import { ID_BODY_PATTERN } from './id-pattern.constants';
import type { IdPrefix } from './id-source.type';

const isId = (value: string, prefix: IdPrefix): boolean =>
  new RegExp(`^${prefix}_${ID_BODY_PATTERN}$`).test(value);

export { isId };
