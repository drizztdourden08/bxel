/* @layer renderer-app @kind logic */
import type { ArgSchema } from '@drizztdourden08/brock-react';

const slotArgs = (count: number): ArgSchema => ({
  slot: { type: 'number', label: 'Slot', min: 1, max: count, options: Array.from({ length: count }, (_, at) => ({ value: at + 1, label: `Slot ${at + 1}` })) },
});

export { slotArgs };
