/* @layer renderer-app @kind constants */
import type { DrawSurface } from './tool-catalogue.type';

const PAINT_SURFACES: readonly DrawSurface[] = ['sprite', 'tile'];

const MAP_SURFACES: readonly DrawSurface[] = ['map'];

const ALL_SURFACES: readonly DrawSurface[] = ['sprite', 'tile', 'map', 'sheet'];

export { ALL_SURFACES, MAP_SURFACES, PAINT_SURFACES };
