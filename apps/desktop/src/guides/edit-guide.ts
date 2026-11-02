/* @layer renderer-app @kind logic */
import type { AxisArgs } from '../context-menu/menu-args.type';
import { useGuideDialogStore } from '../stores/useGuideDialogStore';
import { guideScope } from './guide-scope';

const editGuide = (args: Partial<AxisArgs>): void => {
  const scope = guideScope();
  if (!scope?.size()) return;
  const axis = args.axis ?? 'x';
  const at = args.position;
  const existing = at !== undefined && (scope.lines()?.[axis] ?? []).includes(at);
  useGuideDialogStore.getState().show({ axis, from: existing ? at : null, position: at ?? 0 });
};

export { editGuide };
