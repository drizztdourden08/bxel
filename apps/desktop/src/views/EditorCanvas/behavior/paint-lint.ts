/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { LINT_COLOURS } from '../../../pixel-lint/pixel-lint.constants';
import { lintOfFrame } from '../../../pixel-lint/lint-of-target';
import { useLintStore } from '../../../stores/useLintStore';
import type { PixelView } from '../../PixelViewport';

/** Outlines the pixels the lint finds on the frame being edited. Drawn in image pixels. */
const paintLint = (ctx: CanvasRenderingContext2D, view: PixelView): void => {
  const target = currentTarget();
  if (!target || !useLintStore.getState().shown) return;
  const line = 1.5 / view.zoom;
  ctx.save();
  ctx.lineWidth = line;
  for (const finding of lintOfFrame(target.sprite, target.frameId)) {
    ctx.strokeStyle = LINT_COLOURS[finding.rule];
    ctx.strokeRect(finding.x + line / 2, finding.y + line / 2, finding.width - line, finding.height - line);
  }
  ctx.restore();
};

export { paintLint };
