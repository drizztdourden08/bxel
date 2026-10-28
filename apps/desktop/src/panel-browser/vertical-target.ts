/* @layer renderer-app @kind logic */
import { PAGE_ROWS } from './project-browser.constants';

const vertical = (press: string, index: number, count: number): number | null => {
  if (press === 'ArrowDown') return index + 1;
  if (press === 'ArrowUp') return index - 1;
  if (press === 'Home') return 0;
  if (press === 'End') return count - 1;
  if (press === 'PageDown') return index + PAGE_ROWS;
  return press === 'PageUp' ? index - PAGE_ROWS : null;
};

const verticalTarget = (press: string, index: number, count: number): number | null => {
  const target = vertical(press, index, count);
  return target === null ? null : Math.min(count - 1, Math.max(0, target));
};

export { verticalTarget };
