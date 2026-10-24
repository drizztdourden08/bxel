/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { checkPlatform, findNewBreaks } from '@bxel/presets';
import { artworkFacts } from '../platform-preset/artwork-facts';
import { buildReport } from '../platform-preset/build-report';
import { STRICT_TEXT } from '../platform-preset/platform-preset.constants';
import { presetById } from '../platform-preset/preset-by-id';
import type { SpriteCheck, SpriteSize } from './new-sprite.type';

const spriteCheck = (artwork: Artwork | undefined, size: SpriteSize): SpriteCheck => {
  const preset = presetById(artwork?.platformId);
  if (!artwork || !preset) return { report: null, blocked: null };
  const report = { ...buildReport(preset, { banks: [], sprites: [size] }), strict: artwork.platformStrict === true };
  if (!report.strict) return { report, blocked: null };
  const facts = artworkFacts(artwork);
  const after = checkPlatform(preset, { ...facts, sprites: [...facts.sprites, size] });
  const broken = findNewBreaks(checkPlatform(preset, facts), after)[0];
  return { report, blocked: broken ? STRICT_TEXT.sizeBlocked(broken.message) : null };
};

export { spriteCheck };
