/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { STAMP_SLOTS } from '../stores/tilemap-store.constants';
import { recallStamp } from '../tilemap/recall-stamp';
import { storeStamp } from '../tilemap/store-stamp';
import { turnStampKey } from '../tilemap/turn-stamp-key';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';
import { slotArgs } from './slot-args';
import { slotBindings } from './slot-bindings';
import { slotOfArgs } from './slot-of-args';
import { TILEMAP_COMMAND } from './tilemap-command-id.constants';

const group = COMMAND_GROUP.tilemap;

const SLOT_COMMANDS: readonly CommandDef[] = [
  {
    id: TILEMAP_COMMAND.storeStamp,
    label: 'Keep the stamp in a slot',
    group,
    args: slotArgs(STAMP_SLOTS),
    bindings: slotBindings(STAMP_SLOTS, (slot) => `Mod+Alt+${slot}`),
    whileTyping: false,
    run: (context) => {
      const slot = slotOfArgs(context);
      if (slot !== null) storeStamp(slot - 1);
    },
  },
  {
    id: TILEMAP_COMMAND.recallStamp,
    label: 'Use the stamp in a slot',
    group,
    args: slotArgs(STAMP_SLOTS),
    bindings: slotBindings(STAMP_SLOTS, (slot) => `Alt+Shift+${slot}`),
    whileTyping: false,
    run: (context) => {
      const slot = slotOfArgs(context);
      if (slot !== null) void recallStamp(slot - 1);
    },
  },
];

const KEY_COMMANDS: readonly CommandDef[] = [
  { id: TILEMAP_COMMAND.stampFlipY, label: 'Flip the stamp top to bottom', group, chord: 'Y', whileTyping: false, run: () => void turnStampKey('flipY') },
  { id: TILEMAP_COMMAND.stampTurnLeft, label: 'Turn the stamp a quarter left', group, chord: 'Shift+Z', whileTyping: false, run: () => void turnStampKey('turnLeft') },
];

const TILEMAP_STAMP_COMMANDS: readonly CommandDef[] = [...SLOT_COMMANDS, ...KEY_COMMANDS].map(ruled);

export { TILEMAP_STAMP_COMMANDS };
