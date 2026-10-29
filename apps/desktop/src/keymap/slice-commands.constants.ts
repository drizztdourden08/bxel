/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { deleteSelectedSlice } from '../slice/delete-selected-slice';
import { selectedSlice } from '../slice/selected-slice';
import { sliceSelectedByTool } from '../slice/slice-selected-by-tool';
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';
import { SLICE_COMMAND as ID } from './slice-command-id.constants';

const SLICE_COMMANDS: readonly CommandDef[] = [
  {
    id: ID.deleteSelected,
    label: 'Delete the selected slice',
    group: COMMAND_GROUP.edit,
    when: sliceSelectedByTool,
    run: () => void deleteSelectedSlice(),
  },
  {
    id: ID.properties,
    label: 'Slice properties...',
    group: COMMAND_GROUP.edit,
    when: sliceSelectedByTool,
    run: () => {
      const slice = selectedSlice();
      if (slice) useSliceToolStore.getState().openDialog(slice.id);
    },
  },
].map(ruled);

export { SLICE_COMMANDS };
