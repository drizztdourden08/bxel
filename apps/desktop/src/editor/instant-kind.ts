/* @layer renderer-app @kind logic */
import type { InstantKind } from './run-instant.type';
import type { PressPlan } from './press-plan.type';

const instantKind = (plan: Extract<PressPlan, { kind: 'pick' | 'fill' }>): InstantKind =>
  plan.kind === 'pick' && plan.ramp === true ? 'pick-ramp' : plan.kind;

export { instantKind };
