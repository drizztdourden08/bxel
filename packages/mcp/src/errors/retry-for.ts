/* @layer core @kind logic */
import { ENGINE_CODE_SET, RETRY_TABLE } from './error-retry.constants';
import type { Retry } from './error.type';

const retryFor = (code: string): Retry => {
  const row = RETRY_TABLE.find(([, codes]) => codes.includes(code));
  if (row) return row[0];
  return ENGINE_CODE_SET.has(code) ? 'fix_input' : 'never';
};

export { retryFor };
