/* @layer renderer-app @kind constants */
const TILEMAP_COMMAND = {
  newTileset: 'tilemap.new_tileset',
  storeStamp: 'tilemap.store_stamp',
  recallStamp: 'tilemap.recall_stamp',
  newTilemap: 'tilemap.new_tilemap',
  addTile: 'tilemap.add_tile',
  duplicateTile: 'tilemap.duplicate_tile',
  deleteTile: 'tilemap.delete_tile',
  makeUnique: 'tilemap.make_unique',
  toggleEdit: 'tilemap.toggle_edit',
  placeTiles: 'tilemap.place_tiles',
  editTile: 'tilemap.edit_tile',
  replaceSelection: 'tilemap.replace_selection',
  replaceEverywhere: 'tilemap.replace_everywhere',
  clearCells: 'tilemap.clear_cells',
  flipX: 'tilemap.flip_x',
  flipY: 'tilemap.flip_y',
  turn: 'tilemap.turn',
  layerUp: 'tilemap.layer_up',
  layerDown: 'tilemap.layer_down',
  selectSame: 'tilemap.select_same',
  captureStamp: 'tilemap.capture_stamp',
  fillWithStamp: 'tilemap.fill_with_stamp',
  stampFlipY: 'tilemap.stamp_flip_y',
  stampTurnLeft: 'tilemap.stamp_turn_left',
} as const;

export { TILEMAP_COMMAND };
