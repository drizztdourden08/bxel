/* @layer renderer-app @kind logic */
import { relativeLinkPath } from '@bxel/document';
import type { AssetRef } from '@bxel/document';
import { rewriteAssetLinks } from '@bxel/document/native';
import { comparablePath } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from '../files/file-name';
import { reasonOf } from '../files/reason-of';
import type { IndexedFile, IndexedLink, LinkIndex } from '../workspace/link-index.type';
import { toSlashes } from '../workspace/to-slashes';
import { HEALTH_TEXT } from './project-health.constants';
import type { FixOutcome, LinkFix } from './project-health.type';
import type { Decision } from './repair-links.type';

const samePath = (left: string, right: string): boolean => (comparablePath(left) ?? left.toLowerCase()) === (comparablePath(right) ?? right.toLowerCase());

const decide = (fix: LinkFix, link: IndexedLink, index: LinkIndex): Decision => {
  if (fix.by === 'remove') return { link: null };
  const from = toSlashes(fix.file);
  if (fix.by === 'id') {
    if (link.state === 'ambiguous') return { reason: HEALTH_TEXT.moreThanOne };
    return link.found === null ? { reason: HEALTH_TEXT.notFoundById } : { link: { id: link.linkId, path: relativeLinkPath(from, link.found.path) } };
  }
  if (fix.to === undefined) return { reason: HEALTH_TEXT.needsPath };
  const wanted = fix.to;
  const target: IndexedFile | undefined = index.files.find((file) => samePath(file.path, wanted));
  if (target === undefined) return { reason: HEALTH_TEXT.noFile(wanted) };
  return target.assetId === link.linkId ? { link: { id: link.linkId, path: relativeLinkPath(from, target.path) } } : { reason: HEALTH_TEXT.wrongId(wanted) };
};

const decided = (fix: LinkFix, index: LinkIndex): Decision => {
  const link = index.links.find((each) => samePath(each.from.path, fix.file) && each.linkId === fix.linkId);
  if (link === undefined) return index.files.some((file) => samePath(file.path, fix.file)) ? { reason: HEALTH_TEXT.noLink(fileName(fix.file), fix.linkId) } : { reason: HEALTH_TEXT.notIndexed(fileName(fix.file)) };
  return decide(fix, link, index);
};

const repairLinks = async (documents: DocumentsPort, index: LinkIndex, fixes: readonly LinkFix[]): Promise<FixOutcome> => {
  const skipped: { fix: LinkFix; reason: string }[] = [];
  const byFile = new Map<string, { fix: LinkFix; link: AssetRef | null }[]>();
  for (const fix of fixes) {
    const choice = decided(fix, index);
    if ('reason' in choice) skipped.push({ fix, reason: choice.reason });
    else byFile.set(toSlashes(fix.file), [...(byFile.get(toSlashes(fix.file)) ?? []), { fix, link: choice.link }]);
  }
  let fixed = 0;
  for (const [file, changes] of byFile) {
    try {
      const bytes = await documents.read(file);
      const next = rewriteAssetLinks(bytes, (link) => {
        const change = changes.find((each) => each.fix.linkId === link.id);
        return change === undefined ? link : change.link;
      });
      if (next === null) continue;
      await documents.write(file, next, { recent: false });
      fixed += changes.length;
    } catch (error) {
      for (const change of changes) skipped.push({ fix: change.fix, reason: HEALTH_TEXT.writeFailed(fileName(file), reasonOf(error)) });
    }
  }
  return { fixed, skipped };
};

export { repairLinks };
