/* @layer renderer-app @kind constants */
const TERRAIN_COMMAND = {
  toggleBrush: 'terrain.toggle_brush',
  fillFromLayout: 'terrain.fill_from_layout',
  fillByTurning: 'terrain.fill_by_turning',
  editSlot: 'terrain.edit_slot',
} as const;

export { TERRAIN_COMMAND };
