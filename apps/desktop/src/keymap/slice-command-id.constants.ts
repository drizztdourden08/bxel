/* @layer renderer-app @kind constants */
const SLICE_COMMAND = {
  deleteSelected: 'slice.delete_selected',
  properties: 'slice.properties',
  fromSelection: 'slice.from_selection',
  toSelection: 'slice.to_selection',
  distributeHorizontal: 'slice.distribute_horizontal',
  distributeVertical: 'slice.distribute_vertical',
} as const;

export { SLICE_COMMAND };
