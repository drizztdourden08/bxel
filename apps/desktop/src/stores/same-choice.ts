/* @layer renderer-app @kind logic */
import type { ChoiceFilter } from './tileset-view-store.type';

const sameChoice = (a: ChoiceFilter, b: ChoiceFilter): boolean => a.field === b.field && a.value === b.value;

export { sameChoice };
