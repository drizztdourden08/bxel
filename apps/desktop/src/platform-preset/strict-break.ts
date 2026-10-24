/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { checkPlatform, findNewBreaks } from '@bxel/presets';
import type { PlatformPreset, RuleFinding } from '@bxel/presets';
import { artworkFacts } from './artwork-facts';
import { FINDINGS_CACHE } from './strict-break.constants';
import { presetById } from './preset-by-id';

const findingsOf = (preset: PlatformPreset, artwork: Artwork): readonly RuleFinding[] => {
  const known = FINDINGS_CACHE.get(artwork);
  if (known) return known;
  const fresh = checkPlatform(preset, artworkFacts(artwork));
  FINDINGS_CACHE.set(artwork, fresh);
  return fresh;
};

const strictBreak = (before: Artwork, after: Artwork): string | null => {
  if (before.platformStrict !== true || after.platformStrict !== true) return null;
  if (before.platformId !== after.platformId) return null;
  const preset = presetById(after.platformId);
  if (!preset) return null;
  return findNewBreaks(findingsOf(preset, before), findingsOf(preset, after))[0]?.message ?? null;
};

export { strictBreak };
