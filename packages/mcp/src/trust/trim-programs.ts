/* @layer core @kind logic */
import { PROGRAM_PROGRAMS_MAX } from './trust.constants';
import type { TrustEntry } from './trust.type';

const trimPrograms = (programs: readonly TrustEntry[]): TrustEntry[] =>
  [...programs]
    .sort((first, second) => second.lastConnected.localeCompare(first.lastConnected))
    .slice(0, PROGRAM_PROGRAMS_MAX);

export { trimPrograms };
