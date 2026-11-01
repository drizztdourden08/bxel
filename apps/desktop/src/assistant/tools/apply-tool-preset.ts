/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { applyPreset } from '../../editor/presets/apply-preset';
import type { ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { isReply } from './is-reply';
import { presetRow } from './preset-row';
import { reply } from './reply';
import { toolBusy } from './tool-busy';
import { presetById } from './user-preset';
import { viewFail } from './view-fail';

const applyToolPreset: ToolHandler = (input, context) => {
  const { id } = input as { id: string };
  const busy = toolBusy();
  if (busy) return busy;
  const preset = presetById(id);
  if (isReply(preset)) return preset;
  if (!applyPreset(preset)) return viewFail(APP_TOOL_TEXT.noMember(preset.member), 'id');
  announce(APP_TOOL_TEXT.viewLine(context.call.session.displayName, `applied the preset ${preset.name}`));
  return reply({ ok: true, preset: presetRow(preset) });
};

export { applyToolPreset };
