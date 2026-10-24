/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { checkPlatform, findNewBreaks } from '@bxel/presets';
import type { PlatformPreset, RuleFinding } from '@bxel/presets';
import { artworkFacts } from './artwork-facts';
import { presetById } from './preset-by-id';
import { FINDINGS_CACHE } from './strict-break.constants';
import { strictGroups } from './strict-groups';
import type { StrictGroup } from './strict-break.type';

const findingsOf = (preset: PlatformPreset, artwork: Artwork, group: StrictGroup): readonly RuleFinding[] => {
  const cache = FINDINGS_CACHE.get(artwork) ?? new Map<string, readonly RuleFinding[]>();
  FINDINGS_CACHE.set(artwork, cache);
  const known = cache.get(group.platformId);
  if (known) return known;
  const fresh = checkPlatform(preset, group.whole ? artworkFacts(artwork) : artworkFacts(artwork, group.sprites));
  cache.set(group.platformId, fresh);
  return fresh;
};

const strictBreak = (before: Artwork, after: Artwork): string | null => {
  const earlier = strictGroups(before);
  for (const group of strictGroups(after)) {
    const preset = presetById(group.platformId);
    const old = earlier.find((each) => each.platformId === group.platformId);
    const message = preset && old ? findNewBreaks(findingsOf(preset, before, old), findingsOf(preset, after, group))[0]?.message : undefined;
    if (message !== undefined) return message;
  }
  return null;
};

export { strictBreak };
