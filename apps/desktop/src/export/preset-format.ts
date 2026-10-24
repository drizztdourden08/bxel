/* @layer renderer-app @kind logic */
import type { ExportFormat } from '@bxel/document';
import type { ExportSettings } from './export.type';

const presetFormat = (settings: ExportSettings): ExportFormat => {
  if (settings.kind === 'sheet' || settings.kind === 'map') return 'sheet';
  if (settings.kind === 'animation') return settings.animation;
  return settings.colour === 'indexed' ? 'png-indexed' : 'png';
};

export { presetFormat };
