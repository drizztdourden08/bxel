/* @layer renderer-app @kind hook */
import { chordKeys, commands, useCommandChords, useIsMac } from '@drizztdourden08/brock-react';
import type { ShortcutKey } from '@drizztdourden08/tessera';
import { WATCHED_COMMAND } from './use-keys-of.constants';

const useSlotKeys = (): ((command: string, slot: number | null) => ShortcutKey[] | undefined) => {
  const mac = useIsMac();
  useCommandChords(WATCHED_COMMAND);
  return (command, slot) => {
    const binding = slot === null ? undefined : commands.bindings(command).find((each) => each.args.slot === slot);
    const [chord] = binding?.chords ?? [];
    const keys = chord === undefined ? [] : chordKeys(chord, mac);
    return keys.length > 0 ? keys : undefined;
  };
};

export { useSlotKeys };
