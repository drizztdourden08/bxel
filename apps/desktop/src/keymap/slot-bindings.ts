/* @layer renderer-app @kind logic */
import type { DefaultBinding } from '@drizztdourden08/brock-react';

const slotBindings = (count: number, chordOf: (slot: number) => string): DefaultBinding[] =>
  Array.from({ length: count }, (_, at) => ({ args: { slot: at + 1 }, chord: chordOf(at + 1) }));

export { slotBindings };
