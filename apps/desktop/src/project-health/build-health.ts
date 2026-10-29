/* @layer renderer-app @kind logic */
import { fileName } from '../files/file-name';
import type { IndexedLink, LinkIndex } from '../workspace/link-index.type';
import { linkFixId } from './link-fix-id';
import { misplacedFiles } from './misplaced-files';
import { EMPTY_REPORT, LEAF_KINDS } from './project-health.constants';
import type { FileFinding, HealthContext, HealthReport, LinkFinding } from './project-health.type';
import { protectedIds } from './protected-ids';

const findingOf = (link: IndexedLink, index: LinkIndex): LinkFinding => ({
  fix: linkFixId(link.from.path, link.linkId),
  file: link.from.path,
  fileName: fileName(link.from.path),
  fileKind: link.from.kind,
  linkId: link.linkId,
  targetName: link.targetName,
  targetKind: link.targetKind,
  lastPath: link.target,
  state: link.state,
  foundPath: link.found?.path ?? null,
  candidates: link.state === 'ambiguous' ? index.files.filter((file) => file.assetId === link.linkId).map((file) => file.path) : [],
});

const unusedFiles = (index: LinkIndex, context: HealthContext): readonly FileFinding[] => {
  const used = new Set(index.links.flatMap((link) => (link.found === null ? [] : [link.found.assetId])));
  const kept = protectedIds(context.project, index.files);
  return index.files
    .filter((file) => LEAF_KINDS.has(file.kind) && !used.has(file.assetId) && !kept.has(file.assetId))
    .map((file) => ({ fix: `unused:${file.path}`, path: file.path, name: file.name, kind: file.kind }));
};

const buildHealth = (index: LinkIndex, context: HealthContext): HealthReport => {
  const broken = index.links.filter((link) => link.state === 'missing' || link.state === 'ambiguous').map((link) => findingOf(link, index));
  const moved = index.links.filter((link) => link.state === 'moved').map((link) => findingOf(link, index));
  const access = context.project.folders
    .filter((folder) => !folder.granted)
    .map((folder) => ({ fix: `access:${folder.folderId}`, folderId: folder.folderId, name: folder.name, path: folder.path }));
  const report = {
    ...EMPTY_REPORT,
    broken,
    moved,
    unused: unusedFiles(index, context),
    misplaced: misplacedFiles(context.project, index.files),
    duplicates: index.duplicates,
    unsaved: context.unsaved,
    access,
    files: index.files.length,
  };
  return { ...report, total: report.broken.length + report.moved.length + report.unused.length + report.misplaced.length + report.duplicates.length + (report.unsaved > 0 ? 1 : 0) + report.access.length };
};

export { buildHealth };
