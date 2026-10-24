/* @layer core @kind logic */
import type { ExportPreset } from '../model/export-preset.type';
import type { SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const named = (gone: ReadonlySet<SpriteId>) => (ref: unknown): boolean => typeof ref === 'string' && gone.has(ref as SpriteId);

const prune = (preset: ExportPreset, gone: ReadonlySet<SpriteId>): ExportPreset | null => {
  const isGone = named(gone);
  if (!preset.scope.sprites.some(isGone)) return preset;
  const sprites = preset.scope.sprites.filter((ref) => !isGone(ref));
  if (sprites.length === 0 && preset.sheetId === null) return null;
  return { ...preset, scope: { ...preset.scope, sprites } };
};

const prunePresets = (draft: Draft, gone: ReadonlySet<SpriteId>): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    presets: artwork.presets.flatMap((preset) => prune(preset, gone) ?? []),
  }));
};

export { prunePresets };
