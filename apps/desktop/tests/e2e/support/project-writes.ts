/* @layer renderer-app @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { manifestFileName, parseManifest } from '@bxel/project';
import { callMcp } from './call-mcp';
import type { ProjectRig } from './project-rig.type';

const locationIn = async (rig: ProjectRig, name: string, path: string) => {
  const parsed = parseManifest(await readFile(join(rig.projectDir, manifestFileName(name)), 'utf8'));
  if (!parsed.ok) throw new Error(parsed.message);
  return { projectId: parsed.value.projectId, folderId: parsed.value.folders[0]?.folderId, path };
};

const heroDocument = async (rig: ProjectRig, name: string): Promise<string> => {
  const opened = await callMcp(rig.link.client, 'open_file', { file: await locationIn(rig, name, 'hero.bxel') });
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
