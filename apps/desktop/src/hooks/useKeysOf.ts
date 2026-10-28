/* @layer renderer-app @kind hook */
import { chordKeys, commands, useCommandChords, useIsMac } from '@drizztdourden08/brock-react';
import { WATCHED_COMMAND } from './use-keys-of.constants';
import type { KeysOf } from './use-keys-of.type';

const useKeysOf = (): KeysOf => {
  const mac = useIsMac();
  useCommandChords(WATCHED_COMMAND);
  return (command) => {
    if (command === undefined) return undefined;
    const [chord] = commands.chords(command);
    const keys = chord === undefined ? [] : chordKeys(chord, mac);
    return keys.length > 0 ? keys : undefined;
  };
};

export { useKeysOf };
