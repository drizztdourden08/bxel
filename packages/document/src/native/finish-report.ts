/* @layer core @kind logic */
import { entryPaths } from './entry-paths';
import type { DamagedCel, LoadIssue, LoadReport } from './load-report.type';
import { makeIssue } from './make-issue';
import { previewIssue } from './preview-issue';
import type { ReportParts } from './report-parts.type';

const RECOVERABLE_NOTICE = 'Some pixels are damaged. The document opens read-only; Save As keeps a recovered copy.';

const damageIssue = (damage: DamagedCel): LoadIssue =>
  makeIssue(damage.code, damage.message, entryPaths.cel(damage.celId));

const finishReport = ({ opened, read, built, check }: ReportParts): LoadReport => {
  const { manifest } = opened;
  const preview = previewIssue(manifest, check);
  const recoverable = built.damage.length > 0 || preview !== null;
  const previewBytes = manifest.preview === null || preview ? null : (check.good.get(manifest.preview) ?? null);
  return {
    outcome: recoverable ? 'recoverable' : 'ok',
    project: built.project,
    readOnly: opened.readOnly || recoverable,
    notice: opened.notice ?? (recoverable ? RECOVERABLE_NOTICE : null),
    migrated: read.migrated,
    manifest,
    preview: previewBytes,
    issues: [...built.damage.map(damageIssue), ...(preview ? [preview] : [])],
    damage: built.damage,
  };
};

export { finishReport };
