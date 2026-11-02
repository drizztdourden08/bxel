/* @layer renderer-app @kind constants */
const TILESET_COMMAND = {
  modeTiles: 'tileset.mode_tiles',
  modeTerrain: 'tileset.mode_terrain',
  modeCollision: 'tileset.mode_collision',
  modeData: 'tileset.mode_data',
  modeAnimation: 'tileset.mode_animation',
  focusSearch: 'tileset.focus_search',
  animationFromTiles: 'tileset.animation_from_tiles',
  findOnMap: 'tileset.find_on_map',
  copyCollision: 'tileset.copy_collision',
  pasteCollision: 'tileset.paste_collision',
  copyData: 'tileset.copy_data',
  pasteData: 'tileset.paste_data',
  useAsStamp: 'tileset.use_as_stamp',
  useAsScatter: 'tileset.use_as_scatter',
  setCollision: 'tileset.set_collision',
  deleteTiles: 'tileset.delete_tiles',
  moveTile: 'tileset.move_tile',
  addTileAt: 'tileset.add_tile_at',
  shapeAddBox: 'tileset.shape_add_box',
  shapeTrace: 'tileset.shape_trace',
  shapeDelete: 'tileset.shape_delete',
  shapeDeletePoint: 'tileset.shape_delete_point',
  shapeSnap: 'tileset.shape_snap',
} as const;

export { TILESET_COMMAND };
