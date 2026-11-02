/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { STAMP_SLOTS } from '../stores/tilemap-store.constants';
import { recallStamp } from '../tilemap/recall-stamp';
import { storeStamp } from '../tilemap/store-stamp';
import { turnStampKey } from '../tilemap/turn-stamp-key';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';
import { TILEMAP_COMMAND } from './tilemap-command-id.constants';

const group = COMMAND_GROUP.tilemap;

const SLOTS = Array.from({ length: STAMP_SLOTS }, (_, at) => at);

const SLOT_COMMANDS: readonly CommandDef[] = SLOTS.flatMap((at) => [
  { id: TILEMAP_COMMAND.storeStamp(at + 1), label: `Keep the stamp in slot ${at + 1}`, group, chord: `Mod+Alt+${at + 1}`, whileTyping: false, run: () => storeStamp(at) },
  { id: TILEMAP_COMMAND.recallStamp(at + 1), label: `Use the stamp in slot ${at + 1}`, group, chord: `Alt+Shift+${at + 1}`, whileTyping: false, run: () => void recallStamp(at) },
]);

const KEY_COMMANDS: readonly CommandDef[] = [
  { id: TILEMAP_COMMAND.stampFlipY, label: 'Flip the stamp top to bottom', group, chord: 'Y', whileTyping: false, run: () => void turnStampKey('flipY') },
  { id: TILEMAP_COMMAND.stampTurnLeft, label: 'Turn the stamp a quarter left', group, chord: 'Shift+Z', whileTyping: false, run: () => void turnStampKey('turnLeft') },
];

const TILEMAP_STAMP_COMMANDS: readonly CommandDef[] = [...SLOT_COMMANDS, ...KEY_COMMANDS].map(ruled);

export { TILEMAP_STAMP_COMMANDS };
