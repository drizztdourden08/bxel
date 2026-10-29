/* @layer renderer-app @kind logic */
import type { McpResult } from '@bxel/mcp';
import { buildHealth } from '../../project-health/build-health';
import { repairLinks as writeFixes } from '../../project-health/repair-links';
import type { LinkFix } from '../../project-health/project-health.type';
import type { OpenProject } from '../../project/project.type';
import { scanLinkIndex } from '../../workspace/scan-link-index';
import type { ToolHandler } from '../assistant.type';
import { placePath } from './place-path';
import type { RepairLinksInput } from './project-files-input.type';
import { reply } from './reply';
import { visibleProject } from './visible-project';

const fixesOf = (visible: OpenProject, request: RepairLinksInput): McpResult<readonly LinkFix[]> => {
  const fixes: LinkFix[] = [];
  for (const [at, fix] of (request.fixes ?? []).entries()) {
    const file = placePath(visible, fix.file, `fixes.${at}.file`);
    if (!file.ok) return file;
    const to = fix.to === undefined ? null : placePath(visible, fix.to, `fixes.${at}.to`);
    if (to !== null && !to.ok) return to;
    fixes.push({ file: file.value, linkId: fix.linkId, by: fix.by, ...(to === null ? {} : { to: to.value }) });
  }
  return { ok: true, value: fixes };
};

const repairLinks: ToolHandler = async (input, context) => {
  const request = input as RepairLinksInput;
  const scope = visibleProject(context, request.projectId, true);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  const fixes = fixesOf(visible, request);
  if (!fixes.ok) return reply(fixes);
  const index = await scanLinkIndex(context.documents, visible);
  const following: readonly LinkFix[] = request.all === true ? buildHealth(index, { project: visible, unsaved: 0 }).moved.map((finding) => ({ file: finding.file, linkId: finding.linkId, by: 'id' })) : [];
  const outcome = await writeFixes(context.documents, index, [...following, ...fixes.value]);
  return reply({
    ok: true,
    projectId: request.projectId,
    fixed: outcome.fixed,
    skipped: outcome.skipped.map((each) => ({ file: each.fix.file, linkId: each.fix.linkId, reason: each.reason })),
  });
};

export { repairLinks };
