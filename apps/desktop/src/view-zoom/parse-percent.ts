/* @layer renderer-app @kind logic */
import { clampPercent } from './clamp-percent';

const parsePercent = (text: string): number | null => {
  const digits = /^\s*(\d+(?:\.\d+)?)\s*%?\s*$/.exec(text);
  if (!digits?.[1]) return null;
  return clampPercent(Number(digits[1]));
};

export { parsePercent };
