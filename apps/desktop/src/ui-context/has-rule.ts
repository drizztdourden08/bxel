/* @layer renderer-app @kind logic */
import { ALL_RULES } from './all-rules.constants';

const hasRule = (id: string): boolean => Object.hasOwn(ALL_RULES, id);

export { hasRule };
