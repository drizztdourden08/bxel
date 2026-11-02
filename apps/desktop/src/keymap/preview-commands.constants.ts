/* @layer renderer-app @kind constants */
import { announce } from '@drizztdourden08/brock-react';
import type { CommandDef } from '@drizztdourden08/brock-react';
import { usePreviewStore } from '../stores/usePreviewStore';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';
import { ruled } from './ruled';

const PREVIEW_COMMANDS: readonly CommandDef[] = [
  {
    id: COMMAND_ID.previewSection,
    label: 'Preview',
    group: COMMAND_GROUP.view,
    chord: 'F7',
    checked: () => usePreviewStore.getState().shown,
    run: () => {
      usePreviewStore.getState().toggle();
      announce(`Preview ${usePreviewStore.getState().shown ? 'shown' : 'hidden'}`);
    },
  },
].map(ruled);

export { PREVIEW_COMMANDS };
