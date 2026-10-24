/* @layer renderer-app @kind hook */
import { chordKeys, useCommandChords, useIsMac } from '@drizztdourden08/brock-react';
import type { ShortcutKey } from '@drizztdourden08/tessera';

const useCommandKeys = (command: string | undefined): ShortcutKey[][] => {
  const chords = useCommandChords(command ?? '');
  const mac = useIsMac();
  return chords.map((chord) => chordKeys(chord, mac)).filter((keys) => keys.length > 0);
};

export { useCommandKeys };
