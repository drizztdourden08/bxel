/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { EditorTarget } from '../../../editor/editor.type';
import { gesture } from '../../../editor/gesture-state';
import { pathDraft } from '../../../editor/path-draft';
import type { DrawPlan } from '../../../editor/press-plan.type';
import { startSession } from '../../../editor/start-session';
import { cancelGesture } from './cancel-gesture';
import { gestureLive } from './gesture-live';
import { showSession } from './show-session';
import { startSprayTimer } from './start-spray-timer';

const beginGesture = (plan: DrawPlan, target: EditorTarget, at: Point): void => {
  if (pathDraft.current) cancelGesture();
  const started = startSession(plan, target, at);
  gestureLive.session = started;
  gesture.dragging = started.kind === 'shape';
  if (started.kind === 'path') pathDraft.current = started;
  if (started.kind === 'spray') startSprayTimer();
  showSession(started);
};

export { beginGesture };
