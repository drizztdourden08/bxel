/* @layer core @kind logic */
import { NAME_PATTERN_TOKEN } from './expand-name-pattern.constants';

const expandNamePattern = (pattern: string, name: string, number: number): string =>
  pattern.replace(NAME_PATTERN_TOKEN, (_match, kind: string, pad: string | undefined) =>
    kind === 'name' ? name : String(number).padStart(Number(pad ?? 0), '0'),
  );

export { expandNamePattern };
