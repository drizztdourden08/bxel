/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { ToolPreset } from '../../editor/presets/tool-preset.type';
import { memberById } from '../../editor/tool-catalogue/member-by-id';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import type { ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { isReply } from './is-reply';
import { presetFieldsOf } from './preset-fields-of';
import { presetRow } from './preset-row';
import { reply } from './reply';
import { userPreset } from './user-preset';
import { viewFail } from './view-fail';

const updateToolPreset: ToolHandler = (input, context) => {
  const { id, name, fields } = input as { id: string; name?: string; fields?: Record<string, unknown> };
  const preset = userPreset(id);
  if (isReply(preset)) return preset;
  const found = memberById(preset.member);
  if (!found) return viewFail(APP_TOOL_TEXT.noMember(preset.member), 'id');
  const values = fields === undefined ? preset.fields : presetFieldsOf(found.member.tool, fields, 'fields');
  if (isReply(values)) return values;
  if (Object.keys(values).length === 0) return viewFail('fields: a preset needs at least one option.', 'fields');
  const next: ToolPreset = { ...preset, name: name === undefined ? preset.name : name.trim(), fields: values };
  useToolPresetStore.getState().save(next);
  announce(APP_TOOL_TEXT.viewLine(context.call.session.displayName, `changed the preset ${next.name}`));
  return reply({ ok: true, preset: presetRow(next) });
};

export { updateToolPreset };
