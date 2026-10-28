/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { currentTarget } from '../../editor/current-target';
import { selectionMask } from '../../editor/selection/selection-mask';
import type { ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { SetViewInput } from './app-tool-input.type';
import { reply } from './reply';
import { selectionReply } from './selection-reply';
import { VIEW_STEPS } from './set-view.constants';

const selectionNow = () => {
  const target = currentTarget();
  return selectionReply(target ? selectionMask(target) : null);
};

const setView: ToolHandler = (input, context) => {
  const patch = input as SetViewInput;
  const applied: string[] = [];
  for (const [field, step] of VIEW_STEPS) {
    if (patch[field] === undefined) continue;
    const failed = step(patch, context);
    if (failed) return failed;
    applied.push(field);
  }
  const { displayName } = context.call.session;
  if (applied.length > 0) announce(APP_TOOL_TEXT.viewLine(displayName, `changed the view (${applied.join(', ')})`));
  return reply({
    ok: true,
    applied,
    visible: context.call.instance.window === 'visible',
    selection: applied.includes('selection') ? selectionNow() : null,
  });
};

export { setView };
