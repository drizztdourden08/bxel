/* @layer renderer-app @kind logic */
import { SURFACE_PARTS } from './surface.constants';
import type { Surface, SurfacePart } from './surface.type';

const hasPart = (surface: Surface, part: SurfacePart): boolean => SURFACE_PARTS[surface].includes(part);

export { hasPart };
