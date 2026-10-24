/* @layer renderer-app @kind logic */
import type { ManagerFilter } from './manager.type';

const activeFilters = (filter: ManagerFilter): number =>
  [filter.animated, filter.unplaced, filter.size !== null, filter.identical !== 'off', filter.tag !== null, filter.bank !== null].filter(Boolean).length;

export { activeFilters };
