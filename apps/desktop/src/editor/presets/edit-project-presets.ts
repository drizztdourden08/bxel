/* @layer renderer-app @kind logic */
import type { ProjectToolPreset } from '@bxel/project';
import { saveManifest } from '../../project/save-manifest';
import { useProjectStore } from '../../stores/useProjectStore';

const editProjectPresets = async (edit: (list: readonly ProjectToolPreset[]) => readonly ProjectToolPreset[]): Promise<boolean> => {
  const project = useProjectStore.getState().project;
  if (!project) return false;
  const toolPresets = edit(project.manifest.toolPresets ?? []);
  const { toolPresets: _replaced, ...rest } = project.manifest;
  const outcome = await saveManifest(toolPresets.length === 0 ? rest : { ...rest, toolPresets });
  return outcome.ok;
};

export { editProjectPresets };
