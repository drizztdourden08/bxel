/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PathSession } from '../../../editor/editor.type';
import { pathDraft } from '../../../editor/path-draft';
import type { DrawPlan } from '../../../editor/press-plan.type';
import { continueDraft } from './continue-draft';
import type { DraftClick } from './draft-click.type';

const continuing = (draft: PathSession | null, plan: DrawPlan): draft is PathSession =>
  draft !== null && plan.kind === 'path' && plan.tool === draft.tool && (draft.tool === 'polygon' || draft.phase === 'bend');

const pressDraft = (plan: DrawPlan, at: Point, click: DraftClick): boolean => {
  const draft = pathDraft.current;
  if (!continuing(draft, plan)) return false;
  continueDraft(draft, at, click);
  return true;
};

export { pressDraft };
