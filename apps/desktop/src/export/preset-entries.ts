/* @layer renderer-app @kind logic */
import { presetsOf } from '@bxel/document';
import type { Artwork, AssetKey, ExportPreset } from '@bxel/document';
import type { SavedPreset } from './export.type';
import type { PresetEntry, PresetOrigin } from './preset-entry.type';
import { savedFromPreset } from './saved-from-preset';

const documentEntry = (origin: PresetOrigin) => (preset: ExportPreset): PresetEntry => ({
  key: `doc:${preset.id}`,
  id: preset.id,
  name: preset.name,
  origin,
  settings: savedFromPreset(preset).settings,
});

const appEntry = (preset: SavedPreset): PresetEntry => ({ key: `app:${preset.name}`, id: null, name: preset.name, origin: 'app', settings: preset.settings });

const documentEntries = (artwork: Artwork | null, tab: AssetKey | null): readonly PresetEntry[] => {
  if (!artwork) return [];
  const own = tab && (tab.kind === 'sprite' || tab.kind === 'sheet') ? presetsOf(artwork, tab) : [];
  return [...own.map(documentEntry('asset')), ...presetsOf(artwork, { kind: 'project', id: artwork.id }).map(documentEntry('project'))];
};

const presetEntries = (artwork: Artwork | null, tab: AssetKey | null, app: readonly SavedPreset[]): readonly PresetEntry[] => [
  ...documentEntries(artwork, tab),
  ...app.map(appEntry),
];

export { presetEntries };
