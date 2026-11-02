/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { chooseReferenceImage } from '../reference-image/choose-reference-image';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const REFERENCE_COMMANDS: readonly CommandDef[] = [
  { id: 'view.add_reference', label: 'Add a reference image', group: COMMAND_GROUP.view, run: () => void chooseReferenceImage() },
].map(ruled);

export { REFERENCE_COMMANDS };
