/* @layer renderer-app @kind logic */
import type { ProjectDocument, ProjectExport } from '@bxel/project';
import { useProjectStore } from '../stores/useProjectStore';
import { applyProjectChange } from './apply-project-change';
import type { ExportPatch, ProjectFocus, ProjectOutcomeText } from './project-config.type';

const pruned = (settings: Readonly<Record<string, unknown>>): ProjectExport => Object.fromEntries(Object.entries(settings).filter(([, value]) => value !== undefined));

const withExport = (manifest: ProjectDocument, settings: ProjectExport): ProjectDocument => {
  const { export: _dropped, ...rest } = manifest;
  return Object.keys(settings).length === 0 ? rest : { ...rest, export: settings };
};

const setProjectExport = (focus: ProjectFocus, patch: ExportPatch): Promise<ProjectOutcomeText> => {
  const current = useProjectStore.getState().project?.manifest ?? focus.project.manifest;
  const settings = pruned({ ...current.export, ...patch });
  return applyProjectChange(focus, withExport(current, settings), {});
};

export { setProjectExport };
