/* @layer core @kind logic */
import { LOAD_ERROR } from '../load-error.constants';
import type { LoadIssue } from '../load-report.type';
import { makeIssue } from '../make-issue';
import type { AssetManifest } from './asset-manifest.type';
import type { SheetFileJson } from './sheet-file.type';

const sheetAnimationIssues = (file: SheetFileJson, manifest: AssetManifest): readonly LoadIssue[] => {
  const linked = new Set(manifest.links.map((link) => link.id));
  return (file.sheet.animationEntries ?? []).flatMap((entry, index) =>
    linked.has(entry.animationId)
      ? []
      : [
          makeIssue(
            LOAD_ERROR.REFERENCE_BROKEN,
            `The sheet places animation ${entry.animationId}, which it does not link.`,
            `$.sheet.animationEntries[${index}].animationId`,
          ),
        ],
  );
};

export { sheetAnimationIssues };
