/* @layer renderer-app @kind logic */
import type { Surface } from './surface.type';
import type { DrawSurface } from './tool-catalogue.type';

const drawSurface = (surface: Surface): DrawSurface => (surface === 'none' ? 'sprite' : surface);

export { drawSurface };
