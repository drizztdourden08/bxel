/* @layer renderer-app @kind logic */
import { unsavedFiles } from '../../project-health/unsaved-files';
import { buildHealth } from '../../project-health/build-health';
import { HEALTH_CHECKS, HEALTH_TEXT } from '../../project-health/project-health.constants';
import type { HealthCheck, HealthReport, LinkFinding } from '../../project-health/project-health.type';
import type { OpenProject } from '../../project/project.type';
import { scanLinkIndex } from '../../workspace/scan-link-index';
import type { ToolHandler } from '../assistant.type';
import { locateInProject } from './locate-in-project';
import type { ProjectHealthInput } from './project-files-input.type';
import type { Finding } from './project-health.type';
import { reply } from './reply';
import { visibleProject } from './visible-project';

const linkFinding = (project: OpenProject, check: HealthCheck, link: LinkFinding): Finding => ({
  check,
  fix: link.fix,
  message: HEALTH_TEXT.linkLine(link.fileName, link.targetName),
  file: locateInProject(project, link.file),
  linkId: link.linkId,
  ...(check === 'moved' ? { foundAt: link.foundPath === null ? null : locateInProject(project, link.foundPath) } : {}),
});

const findingsOf = (project: OpenProject, report: HealthReport): Finding[] => [
  ...report.broken.map((each) => linkFinding(project, 'broken', each)),
  ...report.moved.map((each) => linkFinding(project, 'moved', each)),
  ...report.unused.map((each): Finding => ({ check: 'unused', fix: each.fix, message: each.name, file: locateInProject(project, each.path) })),
  ...report.misplaced.map((each): Finding => ({ check: 'misplaced', fix: each.fix, message: `${each.name}. ${HEALTH_TEXT.expected(each.folder)}`, file: locateInProject(project, each.path), expectedFolder: locateInProject(project, each.folder) })),
  ...report.duplicates.map((each): Finding => ({
    check: 'duplicates',
    fix: `duplicate:${each.assetId}`,
    message: HEALTH_TEXT.duplicatesTitle,
    file: locateInProject(project, each.paths[0] ?? ''),
    sharedWith: each.paths.flatMap((path) => locateInProject(project, path) ?? []),
  })),
  ...(report.unsaved > 0 ? [{ check: 'unsaved' as const, fix: 'unsaved', message: HEALTH_TEXT.unsavedCount(report.unsaved), file: null }] : []),
  ...report.access.map((each): Finding => ({ check: 'access', fix: each.fix, message: `${each.name}: ${HEALTH_TEXT.accessHint}`, file: null })),
];

const projectHealth: ToolHandler = async (input, context) => {
  const request = input as ProjectHealthInput;
  const scope = visibleProject(context, request.projectId, false);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  const index = await scanLinkIndex(context.documents, visible);
  const report = buildHealth(index, { project: visible, unsaved: scope.value.found.open ? unsavedFiles() : 0 });
  const wanted = new Set<string>(request.checks ?? HEALTH_CHECKS);
  const findings = findingsOf(visible, report).filter((each) => wanted.has(each.check) && (each.file !== null || each.check === 'unsaved' || each.check === 'access'));
  return reply({ ok: true, projectId: request.projectId, files: report.files, total: findings.length, findings });
};

export { projectHealth };
