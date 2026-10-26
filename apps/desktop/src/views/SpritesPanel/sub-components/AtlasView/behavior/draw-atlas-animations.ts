/* @layer renderer-app @kind logic */
import type { AtlasModel } from '../../../../../sheet-manager/manager.type';
import { frameCanvas } from '../../../behavior/frame-canvas';

const drawAtlasAnimations = (ctx: CanvasRenderingContext2D, atlas: AtlasModel, owner: Document, scale: number): void => {
  for (const animation of atlas.animations) {
    let x = animation.x;
    for (const image of animation.images) {
      ctx.drawImage(frameCanvas(owner, image), x * scale, animation.y * scale, image.width * scale, image.height * scale);
      x += image.width + animation.spacing;
    }
  }
};

export { drawAtlasAnimations };
