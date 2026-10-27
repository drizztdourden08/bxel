/* @layer renderer-app @kind logic */
import type { AtlasModel } from '../../../../../sheet-manager/manager.type';
import { frameCanvas } from '../../../behavior/frame-canvas';
import { drawAtlasCell } from './draw-atlas-cell';

const drawAtlasAnimations = (ctx: CanvasRenderingContext2D, atlas: AtlasModel, owner: Document, scale: number): void => {
  for (const animation of atlas.animations) {
    const [first] = animation.images;
    if (animation.cell && first) {
      drawAtlasCell(ctx, frameCanvas(owner, first), { x: animation.x, y: animation.y, ...animation.cell }, scale);
      continue;
    }
    let x = animation.x;
    for (const image of animation.images) {
      ctx.drawImage(frameCanvas(owner, image), x * scale, animation.y * scale, image.width * scale, image.height * scale);
      x += image.width + animation.spacing;
    }
  }
};

export { drawAtlasAnimations };
