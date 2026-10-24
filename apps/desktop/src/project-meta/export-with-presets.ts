/* @layer renderer-app @kind logic */
import type { ExportPreset } from '@bxel/document';
import type { ProjectDocument } from '@bxel/project';

const exportWithPresets = (manifest: ProjectDocument, presets: readonly ExportPreset[]): Pick<ProjectDocument, 'export'> => {
  const { presets: _dropped, ...rest } = manifest.export ?? {};
  const next = presets.length === 0 ? rest : { ...rest, presets };
  return Object.keys(next).length === 0 ? {} : { export: next };
};

export { exportWithPresets };
