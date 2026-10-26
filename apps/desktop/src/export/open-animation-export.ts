/* @layer renderer-app @kind logic */
import { openExport } from './open-export';

const openAnimationExport = (animationId: string): void => openExport('animation', { animationId });

export { openAnimationExport };
