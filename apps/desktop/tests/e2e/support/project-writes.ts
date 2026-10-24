/* @layer renderer-app @kind logic */
import { callMcp } from './call-mcp';
import { projectOnDisk } from './project-on-disk';
import type { ProjectRig } from './project-rig.type';

const locationIn = async (rig: ProjectRig, name: string, path: string) => {
  const manifest = await projectOnDisk(rig.projectDir, name);
  return { projectId: manifest.projectId, folderId: manifest.folders[0]?.folderId, path };
};

const heroDocument = async (rig: ProjectRig, name: string): Promise<string> => {
  const opened = await callMcp(rig.link.client, 'open_file', { file: await locationIn(rig, name, 'hero.bxsprite') });
  return String(opened.data.documentId);
};

const saveIntoProject = async (rig: ProjectRig, name: string, path: string, known?: string) => {
  const target = { location: await locationIn(rig, name, path), overwrite: false };
  return callMcp(rig.link.client, 'save_document', { documentId: known ?? (await heroDocument(rig, name)), target });
};

const exportIntoProject = async (rig: ProjectRig, name: string, path: string) => {
  const documentId = await heroDocument(rig, name);
  const document = await callMcp(rig.link.client, 'get_document', { documentId });
  const source = { spriteId: String((document.data.sprites as { spriteId: string }[])[0]?.spriteId) };
  return callMcp(rig.link.client, 'export_document', { documentId, format: 'png', source, scale: 1, location: await locationIn(rig, name, path) });
};

export { exportIntoProject, heroDocument, locationIn, saveIntoProject };
