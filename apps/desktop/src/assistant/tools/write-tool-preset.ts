/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { ToolReply } from '@bxel/mcp';
import type { ToolPreset } from '../../editor/presets/tool-preset.type';
import { memberById } from '../../editor/tool-catalogue/member-by-id';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import type { ToolContext } from '../assistant.type';
import type { WriteToolPresetOptions } from './write-tool-preset.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { isReply } from './is-reply';
import { presetFieldsOf } from './preset-fields-of';
import { presetRow } from './preset-row';
import { reply } from './reply';
import { viewFail } from './view-fail';

const writeToolPreset = (context: ToolContext, options: WriteToolPresetOptions): ToolReply => {
  const { base, fields, memberPath, verb } = options;
  const found = memberById(base.member);
  if (!found) return viewFail(APP_TOOL_TEXT.noMember(base.member), memberPath);
  const values = fields === undefined ? base.fields : presetFieldsOf(found.member.tool, fields, 'fields');
  if (isReply(values)) return values;
  if (Object.keys(values).length === 0) return viewFail('fields: a preset needs at least one option.', 'fields');
  const preset: ToolPreset = { ...base, fields: values };
  useToolPresetStore.getState().save(preset);
  announce(APP_TOOL_TEXT.viewLine(context.call.session.displayName, `${verb} the preset ${preset.name}`));
  return reply({ ok: true, preset: presetRow(preset) });
};

export { writeToolPreset };
