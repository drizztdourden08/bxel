/* @layer renderer-app @kind logic */
import type { SplitPlan } from '@bxel/document';
import type { ToolOutcome } from '@bxel/mcp';
import type { OpenProject } from '../../project/project.type';
import { locateInProject } from './locate-in-project';

const splitReport = (project: OpenProject, plan: SplitPlan, paths: ReadonlyMap<string, string>): ToolOutcome => {
  const files = plan.files.flatMap((file) => {
    const path = paths.get(file.key.id);
    const location = path === undefined ? null : locateInProject(project, path);
    return location ? [{ kind: file.key.kind, name: file.name, location, renamed: file.renamed || file.suffix > 0 }] : [];
  });
  return { ok: true, files, skipped: plan.files.length - files.length };
};

export { splitReport };
