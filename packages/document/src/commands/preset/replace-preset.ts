/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateArtwork } from '../../draft/update-artwork';
import type { ExportPreset } from '../../model/export-preset.type';

const replacePreset = (draft: Draft, next: ExportPreset): void => {
  updateArtwork(draft, (artwork) => ({ ...artwork, presets: artwork.presets.map((preset) => (preset.id === next.id ? next : preset)) }));
};

export { replacePreset };
