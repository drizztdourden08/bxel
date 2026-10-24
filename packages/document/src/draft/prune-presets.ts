/* @layer core @kind logic */
import type { ExportPreset } from '../model/export-preset.type';
import type { SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const prune = (preset: ExportPreset, gone: ReadonlySet<SpriteId>): ExportPreset => {
  const named = (ref: unknown): boolean => typeof ref === 'string' && gone.has(ref as SpriteId);
  if (!preset.scope.sprites.some(named)) return preset;
  return { ...preset, scope: { ...preset.scope, sprites: preset.scope.sprites.filter((ref) => !named(ref)) } };
};

const prunePresets = (draft: Draft, gone: ReadonlySet<SpriteId>): void => {
  updateArtwork(draft, (artwork) => ({ ...artwork, presets: artwork.presets.map((preset) => prune(preset, gone)) }));
};

export { prunePresets };
