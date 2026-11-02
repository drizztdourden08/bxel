/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { deleteSelectedSlice } from '../slice/delete-selected-slice';
import { distributeSlices } from '../slice/distribute-slices';
import { selectedSlice } from '../slice/selected-slice';
import { selectionToSlice } from '../slice/selection-to-slice';
import { sliceToSelection } from '../slice/slice-to-selection';
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
    id: ID.distributeHorizontal,
    label: 'Distribute slices horizontally',
    group: COMMAND_GROUP.edit,
    run: () => void distributeSlices('horizontal'),
  },
  {
    id: ID.distributeVertical,
    label: 'Distribute slices vertically',
    group: COMMAND_GROUP.edit,
    run: () => void distributeSlices('vertical'),
  },
  {
    id: ID.fromSelection,
    label: 'Selection to slice',
    group: COMMAND_GROUP.edit,
    run: () => void selectionToSlice(),
  },
  {
    id: ID.toSelection,
    label: 'Slice to selection',
    group: COMMAND_GROUP.edit,
    run: () => void sliceToSelection(),
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
