/* @layer renderer-app @kind logic */
import { SIZE_UNITS } from './project.constants';

const format = (bytes: number, unitAt: number): string => {
  const value = bytes / SIZE_UNITS.step ** unitAt;
  const text = unitAt === 0 || value >= SIZE_UNITS.wholeFrom ? Math.round(value).toString() : value.toFixed(1);
  return `${text} ${SIZE_UNITS.names[unitAt] ?? ''}`;
};

const formatSize = (bytes: number): string => {
  let unitAt = 0;
  while (unitAt < SIZE_UNITS.names.length - 1 && bytes / SIZE_UNITS.step ** (unitAt + 1) >= 1) unitAt += 1;
  return format(bytes, unitAt);
};

export { formatSize };
