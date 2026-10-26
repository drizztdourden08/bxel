/* @layer renderer-app @kind logic */
import type { JsonValue } from '@bxel/document';
import type { ExportSettings } from './export.type';

const presetSettingsJson = (settings: ExportSettings): Readonly<Record<string, JsonValue>> => {
  const { folder: _folder, pathTemplate: _template, approved: _approved, animationId: _animation, ...rest } = settings;
  return rest;
};

export { presetSettingsJson };
