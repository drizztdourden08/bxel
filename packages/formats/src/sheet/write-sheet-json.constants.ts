/* @layer core @kind constants */
const IMAGE_SUFFIX = /\.[^./\\]+$/u;

const TILED_NEEDS_GRID =
  'A Tiled tileset needs a grid layout with the same spacing on both axes, and no trim, rotation or extrusion';

export { IMAGE_SUFFIX, TILED_NEEDS_GRID };
