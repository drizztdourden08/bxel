/* @layer core @kind logic */
import { COUNTER_DIGITS } from './id-pattern.constants';
import type { IdSource } from './id-source.type';

const counterIdSource = (start = 1): IdSource => {
  let position = start;
  return {
    next: (prefix) => {
      const body = String(position).padStart(COUNTER_DIGITS, '0');
      position += 1;
      return `${prefix}_${body}`;
    },
    fork: () => counterIdSource(position),
  };
};

export { counterIdSource };
