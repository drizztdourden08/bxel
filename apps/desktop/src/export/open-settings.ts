/* @layer renderer-app @kind logic */
import type { ProjectExport } from '@bxel/project';
import { applyPatch } from './apply-patch';
import { clampSettings } from './clamp-settings';
import type { ExportOpen, ExportSettings } from './export.type';
import { startSettings } from './start-settings';

const openSettings = (last: ExportSettings | undefined, folder: string, request: ExportOpen | null, project?: ProjectExport): ExportSettings => {
  const start = startSettings(last, folder, project);
  if (request === null) return start;
  const patch = { ...request.settings, ...(request.kind === undefined ? {} : { kind: request.kind }) };
  return clampSettings(applyPatch(start, patch));
};

export { openSettings };
