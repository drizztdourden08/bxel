/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';

const needs = (ready: () => boolean, reason: string): Pick<CommandDef, 'when' | 'reason'> => ({
  when: ready,
  reason: () => (ready() ? null : reason),
});

export { needs };
