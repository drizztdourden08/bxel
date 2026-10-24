/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { artworkAreaFindings } from './area-findings';
import { artworkFacts } from './artwork-facts';
import { buildReport } from './build-report';
import type { PlatformReport } from './platform-preset.type';
import { presetById } from './preset-by-id';

const artworkReport = (artwork: Artwork): PlatformReport | null => {
  const preset = presetById(artwork.platformId);
  if (!preset) return null;
  const report = buildReport(preset, artworkFacts(artwork));
  return { ...report, strict: artwork.platformStrict === true, findings: [...report.findings, ...artworkAreaFindings(artwork, preset)] };
};

export { artworkReport };
