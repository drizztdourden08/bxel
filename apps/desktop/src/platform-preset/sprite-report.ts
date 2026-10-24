/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import { artworkAreaFindings } from './area-findings';
import { artworkFacts } from './artwork-facts';
import { buildReport } from './build-report';
import { effectivePlatform } from './effective-platform';
import type { PlatformReport } from './platform-preset.type';
import { presetById } from './preset-by-id';

const spriteReport = (artwork: Artwork, sprite: Sprite): PlatformReport | null => {
  const effective = effectivePlatform(artwork, sprite);
  const preset = presetById(effective.platformId);
  if (!preset) return null;
  const report = buildReport(preset, artworkFacts(artwork, [sprite]));
  return { ...report, strict: effective.strict, findings: [...report.findings, ...artworkAreaFindings(artwork, preset, [sprite])] };
};

export { spriteReport };
