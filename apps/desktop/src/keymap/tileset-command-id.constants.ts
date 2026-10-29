/* @layer renderer-app @kind constants */
const TILESET_COMMAND = {
  modeTiles: 'tileset.mode_tiles',
  modeTerrain: 'tileset.mode_terrain',
  modeCollision: 'tileset.mode_collision',
  modeData: 'tileset.mode_data',
  modeAnimation: 'tileset.mode_animation',
  focusSearch: 'tileset.focus_search',
  animationFromTiles: 'tileset.animation_from_tiles',
} as const;

export { TILESET_COMMAND };
