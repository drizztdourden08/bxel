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
} as const;

export { TILESET_COMMAND };
