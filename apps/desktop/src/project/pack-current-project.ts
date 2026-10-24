/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import { encodeProject, isInside, joinInside, packProject } from '@bxel/project';
import type { PackPlan } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { saveWorkspace } from '../workspace/save-workspace';
import { packLocations } from './pack-locations';
import { PACK_TEXT } from './pack.constants';
import { PROJECT_FILE_SUFFIX } from './project.constants';
import type { OpenProject } from './project.type';

const readAssets = async (documents: DocumentsPort, project: OpenProject, plan: PackPlan): Promise<Map<string, Uint8Array>> => {
  const assets = new Map<string, Uint8Array>();
  for (const operation of plan.operations) {
    const folder = project.folders.find((each) => each.folderId === operation.from.folderId);
    const path = folder ? joinInside(folder.path, operation.from.path) : null;
    if (path?.ok) assets.set(operation.entry, await documents.read(path.value));
  }
  return assets;
};

const saveFirst = async (): Promise<boolean> => {
  const kit = fileKit();
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project');
  if (!kit || !workspace || workspace.dirty.size === 0) return true;
  const outcome = await saveWorkspace(kit, workspace.documentId);
  return outcome.kind === 'done';
};

const choosePlace = async (documents: DocumentsPort, project: OpenProject): Promise<string | null> => {
  const picked = await documents.saveAs({
    title: PACK_TEXT.saveTitle,
    defaultPath: `${project.manifest.name}${PROJECT_FILE_SUFFIX}`,
    filters: [{ name: PACK_TEXT.filter, extensions: [ASSET_FORMAT.project.extension.slice(1)] }],
  });
  if (picked === null) return null;
  const inside = project.folders.some((folder) => isInside(picked, folder.path));
  if (inside) throw new Error(PACK_TEXT.outside);
  return picked;
};

const packCurrentProject = async (): Promise<void> => {
  const { project } = useProjectStore.getState();
  const kit = fileKit();
  if (!project || !kit) return;
  try {
    if (!(await saveFirst())) return;
    const plan = packProject(project.manifest, await packLocations(kit.documents, project));
    if (!plan.ok) throw new Error(plan.message);
    const place = await choosePlace(kit.documents, project);
    if (place === null) return;
    const bytes = encodeProject({ manifest: plan.value.manifest, preview: project.preview, assets: await readAssets(kit.documents, project, plan.value) }, kit.clock);
    if (!bytes.ok) throw new Error(bytes.message);
    await kit.documents.write(place, bytes.value, { recent: false });
    toast(PACK_TEXT.packed(plan.value.operations.length), { variant: 'success' });
  } catch (error) {
    toast(PACK_TEXT.failed(reasonOf(error)), { variant: 'danger' });
  }
};

export { packCurrentProject };
