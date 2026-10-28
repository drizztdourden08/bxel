/* @layer renderer-app @kind hook */
import { useCommands } from '@drizztdourden08/brock-react';
import type { CommandContext } from '@drizztdourden08/brock-react';
import { gated } from '../keymap/gated';
import type { ZoneKey } from '../keymap/zone-key.type';

const useZoneKey = (key: ZoneKey, run: ((context?: CommandContext) => void) | null): void => {
  useCommands(run === null ? [] : [gated({ ...key, whileTyping: false, run })]);
};

export { useZoneKey };
