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
import { viewFail } from './view-fail';

const presetId = (name: string): string => `user.${Date.now().toString(36)}.${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const saveToolPreset: ToolHandler = (input, context) => {
  const { member, name, fields } = input as { member: string; name: string; fields: Record<string, unknown> };
  const found = memberById(member);
  if (!found) return viewFail(APP_TOOL_TEXT.noMember(member), 'member');
  const values = presetFieldsOf(found.member.tool, fields, 'fields');
  if (isReply(values)) return values;
  if (Object.keys(values).length === 0) return viewFail('fields: a preset needs at least one option.', 'fields');
  const preset: ToolPreset = { id: presetId(name), name: name.trim(), member, fields: values };
  useToolPresetStore.getState().save(preset);
  announce(APP_TOOL_TEXT.viewLine(context.call.session.displayName, `saved the preset ${preset.name}`));
  return reply({ ok: true, preset: presetRow(preset) });
};

export { saveToolPreset };
