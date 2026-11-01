/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { isReply } from './is-reply';
import { userPreset } from './user-preset';
import { writeToolPreset } from './write-tool-preset';

const updateToolPreset: ToolHandler = (input, context) => {
  const { id, name, fields } = input as { id: string; name?: string; fields?: Record<string, unknown> };
  const preset = userPreset(id);
  if (isReply(preset)) return preset;
  return writeToolPreset(context, { ...preset, name: name === undefined ? preset.name : name.trim() }, fields, 'id', 'changed');
};

export { updateToolPreset };
