/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';
import { damageIssue } from '../damage-issue';
import type { EntryCheck } from '../entry-check.type';
import { RECOVERABLE_NOTICE } from '../finish-report.constants';
import { LOAD_ERROR } from '../load-error.constants';
import type { LoadIssue } from '../load-report.type';
import { makeIssue } from '../make-issue';
import { mapDamageIssue } from '../map-damage-issue';
import { previewIssue } from '../preview-issue';
import { MISSING_LINK_NOTICE } from './asset-container.constants';
import type { AssetManifest } from './asset-manifest.type';
import type { AssetReportParts } from './asset-report-parts.type';
import type { AssetReport } from './asset-report.type';

const missingIssue = (link: AssetRef): LoadIssue =>
  makeIssue(LOAD_ERROR.LINK_MISSING, `The linked file ${link.path} was not found.`, link.path);

const noticeOf = (damaged: boolean, missing: readonly AssetRef[]): string | null => {
  if (damaged) return RECOVERABLE_NOTICE;
  return missing.length > 0 ? MISSING_LINK_NOTICE : null;
};

const previewBytes = (manifest: AssetManifest, check: EntryCheck, problem: LoadIssue | null): Uint8Array | null =>
  manifest.preview === null || problem ? null : (check.good.get(manifest.preview) ?? null);

const finishAssetReport = (parts: AssetReportParts): AssetReport => {
  const { opened, check, slice, damage, missing } = parts;
  const mapDamage = parts.mapDamage ?? [];
  const problem = previewIssue(opened.manifest, check);
  const damaged = damage.length + mapDamage.length > 0 || problem !== null;
  return {
    outcome: damaged || missing.length > 0 ? 'recoverable' : 'ok',
    slice,
    readOnly: opened.readOnly || damaged || parts.forceReadOnly === true,
    notice: opened.notice ?? noticeOf(damaged, missing),
    manifest: opened.manifest,
    preview: previewBytes(opened.manifest, check, problem),
    issues: [...missing.map(missingIssue), ...damage.map(damageIssue), ...mapDamage.map(mapDamageIssue), ...(problem ? [problem] : [])],
    damage,
    mapDamage,
    missingLinks: missing,
  };
};

export { finishAssetReport };
