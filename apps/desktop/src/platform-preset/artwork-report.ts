/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank } from '@bxel/document';
import type { BankFacts } from '@bxel/presets';
import { listSprites } from '../sheet/list-sprites';
import { buildReport } from './build-report';
import type { PlatformReport } from './platform-preset.type';
import { presetById } from './preset-by-id';

const bankFacts = (bank: PaletteBank): BankFacts => ({
  name: bank.name,
  cap: bank.cap,
  transparent: bank.transparent,
  colours: bank.slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : [])),
});

const artworkReport = (artwork: Artwork): PlatformReport | null => {
  const preset = presetById(artwork.platformId);
  if (!preset) return null;
  const sprites = listSprites(artwork).map((sprite) => ({ width: sprite.width, height: sprite.height }));
  return buildReport(preset, { banks: artwork.banks.map(bankFacts), sprites });
};

export { artworkReport };
