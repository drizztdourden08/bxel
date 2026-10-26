/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { LegacyCounts } from './workspace.type';

const legacyCounts = (artwork: Artwork): LegacyCounts => ({
  sprites: artwork.sprites.filter((sprite) => sprite.role === 'sprite').length,
  sheets: artwork.sheets.length,
  palettes: artwork.banks.length,
});

export { legacyCounts };
