/* @layer core @kind logic */
import { MIGRATED_EDIT_GRANT, PRESETS } from '../catalogue/preset.constants';
import type { ProgramMode } from '../trust/trust.type';
import { blockedGrant } from './blocked-grant';
import type { Grant } from './grant.type';

const grantOfMode = (mode: ProgramMode): Grant => {
  if (mode === 'blocked') return blockedGrant();
  return mode === 'edit' ? MIGRATED_EDIT_GRANT : PRESETS.read_only.grant;
};

export { grantOfMode };
