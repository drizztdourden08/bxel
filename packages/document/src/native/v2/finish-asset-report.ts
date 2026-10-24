/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';
import { entryPaths } from '../entry-paths';
import { RECOVERABLE_NOTICE } from '../finish-report.constants';
import { LOAD_ERROR } from '../load-error.constants';
import type { DamagedCel, LoadIssue } from '../load-report.type';
import { makeIssue } from '../make-issue';
import { previewIssue } from '../preview-issue';
import { MISSING_LINK_NOTICE } from './asset-container.constants';
import type { AssetReportParts } from './asset-report-parts.type';
import type { AssetReport } from './asset-report.type';

const damageIssue = (damage: DamagedCel): LoadIssue =>
  makeIssue(damage.code, damage.message, entryPaths.cel(damage.celId));

const missingIssue = (link: AssetRef): LoadIssue =>
  makeIssue(LOAD_ERROR.LINK_MISSING, `The linked file ${link.path} was not found.`, link.path);

const noticeOf = (damaged: boolean, missing: readonly AssetRef[]): string | null => {
  if (damaged) return RECOVERABLE_NOTICE;
  return missing.length > 0 ? MISSING_LINK_NOTICE : null;
};

const finishAssetReport = ({ opened, check, slice, damage, missing }: AssetReportParts): AssetReport => {
  const { manifest } = opened;
  const preview = previewIssue(manifest, check);
  const damaged = damage.length > 0 || preview !== null;
  const previewBytes = manifest.preview === null || preview ? null : (check.good.get(manifest.preview) ?? null);
  return {
    outcome: damaged || missing.length > 0 ? 'recoverable' : 'ok',
    slice,
    readOnly: opened.readOnly || damaged,
    notice: opened.notice ?? noticeOf(damaged, missing),
    manifest,
    preview: previewBytes,
    issues: [...missing.map(missingIssue), ...damage.map(damageIssue), ...(preview ? [preview] : [])],
    damage,
    missingLinks: missing,
  };
};

export { finishAssetReport };
