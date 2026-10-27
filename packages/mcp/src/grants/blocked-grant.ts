/* @layer core @kind logic */
import { PRESETS } from '../catalogue/preset.constants';
import type { Grant } from './grant.type';

const blockedGrant = (): Grant => ({ ...PRESETS.read_only.grant, blocked: true });

export { blockedGrant };
