/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { writeToolPreset } from './write-tool-preset';

const presetId = (name: string): string => `user.${Date.now().toString(36)}.${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const saveToolPreset: ToolHandler = (input, context) => {
  const { member, name, fields } = input as { member: string; name: string; fields: Record<string, unknown> };
  return writeToolPreset(context, { base: { id: presetId(name), name: name.trim(), member, fields: {} }, fields, memberPath: 'member', verb: 'saved' });
};

export { saveToolPreset };
