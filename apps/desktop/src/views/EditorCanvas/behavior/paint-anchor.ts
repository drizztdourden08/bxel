/* @layer renderer-app @kind logic */
import type { Animation, Point } from '@bxel/document';
import { strokeCross } from '../../../canvas-look/stroke-cross';
import { ANCHOR_ARM } from '../EditorCanvas.constants';

const paintAnchor = (ctx: CanvasRenderingContext2D, animation: Animation, origin: Point, zoom: number): void => {
  strokeCross(ctx, origin.x + animation.anchor.x2 / 2, origin.y + animation.anchor.y2 / 2, ANCHOR_ARM / zoom);
};

export { paintAnchor };
