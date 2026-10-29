/* @layer renderer-app @kind logic */
import { buildHealth } from '../../project-health/build-health';
import { repairLinks as writeFixes } from '../../project-health/repair-links';
import type { LinkFix } from '../../project-health/project-health.type';
import { scanLinkIndex } from '../../workspace/scan-link-index';
import type { ToolHandler } from '../assistant.type';
import { placePath } from './place-path';
import type { RepairLinksInput } from './project-files-input.type';
import { reply } from './reply';
import { visibleProject } from './visible-project';

const repairLinks: ToolHandler = async (input, context) => {
  const request = input as RepairLinksInput;
  const scope = visibleProject(context, request.projectId, true);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  const index = await scanLinkIndex(context.documents, visible);
  const fixes: LinkFix[] = [];
  if (request.all === true) {
    for (const finding of buildHealth(index, { project: visible, unsaved: 0 }).moved) fixes.push({ file: finding.file, linkId: finding.linkId, by: 'id' });
  }
  for (const [at, fix] of (request.fixes ?? []).entries()) {
    const file = placePath(visible, fix.file, `fixes.${at}.file`);
    if (!file.ok) return reply(file);
    const to = fix.to === undefined ? null : placePath(visible, fix.to, `fixes.${at}.to`);
    if (to !== null && !to.ok) return reply(to);
    fixes.push({ file: file.value, linkId: fix.linkId, by: fix.by, ...(to === null ? {} : { to: to.value }) });
  }
  const outcome = await writeFixes(context.documents, index, fixes);
  return reply({
    ok: true,
    projectId: request.projectId,
    fixed: outcome.fixed,
    skipped: outcome.skipped.map((each) => ({ file: each.fix.file, linkId: each.fix.linkId, reason: each.reason })),
  });
};

export { repairLinks };
