/* @layer core @kind logic */
import { grantOfMode } from '../grants/grant-of-mode';
import type { Grant } from '../grants/grant.type';
import { modeOfGrant } from '../grants/mode-of-grant';
import { readGrant } from '../grants/read-grant';
import { PROGRAM_MODES } from './trust.constants';
import type { ProgramMode } from './trust.type';

const modeOf = (raw: unknown): ProgramMode | null | 'invalid' => {
  if (raw === undefined) return null;
  return PROGRAM_MODES.find((mode) => mode === raw) ?? 'invalid';
};

const grantOfEntry = (rawMode: unknown, rawGrant: unknown): Grant | null => {
  const mode = modeOf(rawMode);
  if (mode === 'invalid') return null;
  const stored = rawGrant === undefined ? null : readGrant(rawGrant);
  if (stored !== null && (mode === null || modeOfGrant(stored) === mode)) return stored;
  return mode === null ? null : grantOfMode(mode);
};

export { grantOfEntry };
