/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { EXPORT_FALLBACK_NAME } from './export.constants';
import type { ExportSettings, Target } from './export.type';
import { safeName } from './safe-name';

const baseName = (artwork: Artwork, settings: ExportSettings, targets: readonly Target[]): string => {
  const typed = safeName(settings.fileName);
  if (typed !== '') return typed;
  const only = targets.length === 1 ? targets[0] : undefined;
  const derived = safeName(only ? only.sprite.name : artwork.name);
  return derived === '' ? EXPORT_FALLBACK_NAME : derived;
};

export { baseName };
