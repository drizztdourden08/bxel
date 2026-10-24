/* @layer core @kind logic */
import type { BuiltArtwork } from './built-artwork.type';
import { damageIssue } from './damage-issue';
import { RECOVERABLE_NOTICE } from './finish-report.constants';
import type { LoadReport } from './load-report.type';
import { mapDamageIssue } from './map-damage-issue';
import { previewIssue } from './preview-issue';
import type { ReportParts } from './report-parts.type';

const hasDamage = (built: BuiltArtwork): boolean => built.damage.length > 0 || built.mapDamage.length > 0;

const finishReport = ({ opened, read, built, check }: ReportParts): LoadReport => {
  const { manifest } = opened;
  const preview = previewIssue(manifest, check);
  const recoverable = hasDamage(built) || preview !== null;
  const previewBytes = manifest.preview === null || preview ? null : (check.good.get(manifest.preview) ?? null);
  return {
    outcome: recoverable ? 'recoverable' : 'ok',
    artwork: built.artwork,
    readOnly: opened.readOnly || recoverable,
    notice: opened.notice ?? (recoverable ? RECOVERABLE_NOTICE : null),
    migrated: read.migrated,
    manifest,
    preview: previewBytes,
    issues: [...built.damage.map(damageIssue), ...built.mapDamage.map(mapDamageIssue), ...(preview ? [preview] : [])],
    damage: built.damage,
    mapDamage: built.mapDamage,
  };
};

export { finishReport };
