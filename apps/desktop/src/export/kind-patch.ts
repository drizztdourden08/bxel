/* @layer renderer-app @kind logic */
import type { ExportKind, ExportSettings } from './export.type';

const kindPatch = (settings: ExportSettings, kind: ExportKind): Partial<ExportSettings> => {
  if (kind === 'sprite') return { kind, frames: 'current' };
  return settings.frames === 'current' ? { kind, frames: 'all' } : { kind };
};

export { kindPatch };
