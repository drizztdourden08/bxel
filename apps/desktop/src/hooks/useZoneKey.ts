/* @layer renderer-app @kind hook */
import { useCommands } from '@drizztdourden08/brock-react';
import type { ZoneKey } from '../keymap/zone-key.type';

const useZoneKey = (key: ZoneKey, run: (() => void) | null): void => {
  useCommands(run === null ? [] : [{ ...key, whileTyping: false, run }]);
};

export { useZoneKey };
