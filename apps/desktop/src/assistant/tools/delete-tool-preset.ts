/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import type { ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { isReply } from './is-reply';
import { reply } from './reply';
import { userPreset } from './user-preset';

const deleteToolPreset: ToolHandler = (input, context) => {
  const { id } = input as { id: string };
  const preset = userPreset(id);
  if (isReply(preset)) return preset;
  useToolPresetStore.getState().remove(id);
  announce(APP_TOOL_TEXT.viewLine(context.call.session.displayName, `deleted the preset ${preset.name}`));
  return reply({ ok: true, deleted: id });
};

export { deleteToolPreset };
