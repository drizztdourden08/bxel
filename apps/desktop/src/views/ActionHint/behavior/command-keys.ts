/* @layer renderer-app @kind logic */
import { commands } from '@drizztdourden08/brock-react';
import type { ShortcutKey } from '@drizztdourden08/tessera';
import { chordKeys } from './chord-keys';
import { isMac } from './is-mac';

const commandKeys = (command: string): ShortcutKey[][] =>
  commands.chords(command).map((chord) => chordKeys(chord, isMac())).filter((keys) => keys.length > 0);

export { commandKeys };
