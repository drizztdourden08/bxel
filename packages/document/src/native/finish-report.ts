/* @layer core @kind logic */
import type { BuiltArtwork } from './built-artwork.type';
import { entryPaths } from './entry-paths';
import { RECOVERABLE_NOTICE } from './finish-report.constants';
import type { DamagedCel, DamagedMapLayer, LoadIssue, LoadReport } from './load-report.type';
import { makeIssue } from './make-issue';
import { previewIssue } from './preview-issue';
import type { ReportParts } from './report-parts.type';

const damageIssue = (damage: DamagedCel): LoadIssue =>
  makeIssue(damage.code, damage.message, entryPaths.cel(damage.celId));

const mapDamageIssue = (damage: DamagedMapLayer): LoadIssue =>
  makeIssue(damage.code, damage.message, entryPaths.tilemapLayer(damage.layerId));

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
