/* @layer renderer-app @kind logic */
import { PATTERN_TOKEN } from './expand-pattern.constants';

const expandPattern = (pattern: string, name: string, number: number): string =>
  pattern.replace(PATTERN_TOKEN, (_match, kind: string, pad: string | undefined) =>
    kind === 'name' ? name : String(number).padStart(Number(pad ?? 0), '0'),
  );

export { expandPattern };
