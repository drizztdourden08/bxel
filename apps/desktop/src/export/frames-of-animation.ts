/* @layer renderer-app @kind logic */
import type { ExportSettings } from './export.type';

const framesOfAnimation = (settings: ExportSettings): boolean => settings.kind === 'frames' && settings.animationId !== '';

export { framesOfAnimation };
