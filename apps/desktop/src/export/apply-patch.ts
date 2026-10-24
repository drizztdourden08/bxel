/* @layer renderer-app @kind logic */
import type { ExportSettings } from './export.type';
import { kindPatch } from './kind-patch';

const applyPatch = (settings: ExportSettings, patch: Partial<ExportSettings>): ExportSettings => {
  const next = { ...settings, ...patch };
  return patch.kind === undefined ? next : { ...next, ...kindPatch(settings, patch.kind) };
};

export { applyPatch };
