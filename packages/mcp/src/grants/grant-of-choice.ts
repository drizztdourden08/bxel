/* @layer core @kind logic */
import { EDIT_DOCUMENTS_GRANT, PRESETS } from '../catalogue/preset.constants';
import type { PairChoice } from '../trust/trust.type';
import { blockedGrant } from './blocked-grant';
import type { Grant } from './grant.type';

const grantOfChoice = (choice: PairChoice): Grant => {
  if (choice === 'blocked') return blockedGrant();
  if (choice === 'full') return PRESETS.full_control.grant;
  return choice === 'edit' ? EDIT_DOCUMENTS_GRANT : PRESETS.read_only.grant;
};

export { grantOfChoice };
