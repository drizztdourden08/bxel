/* @layer renderer-app @kind logic */
import { encodeProject, joinInside, planMigration, projectOk, readManifest, resolveFolders } from '@bxel/project';
import type { ProjectDocument, ProjectManifest, ProjectResult } from '@bxel/project';
import type { DocumentEntry, DocumentsPort } from '@drizztdourden08/brock-core';
import { toast } from '@drizztdourden08/brock-react';
import { browserIdSource } from '../documents/browser-id-source';
import { PROJECT_FILE_SUFFIX, PROJECT_TEXT } from './project.constants';
import type { LoadedManifest } from './project.type';
import { writeMigratedFiles } from './write-migrated-files';

const clock = (): number => Date.now();

const writeProjectFile = async (documents: DocumentsPort, folder: string, manifest: ProjectDocument): Promise<ProjectResult<LoadedManifest>> => {
  const target = joinInside(folder, `${manifest.name}${PROJECT_FILE_SUFFIX}`, 'bxproject');
  if (!target.ok) return target;
  const bytes = encodeProject({ manifest, preview: null, assets: new Map() }, clock);
  if (!bytes.ok) return bytes;
  await documents.write(target.value, bytes.value, { recent: false });
  return projectOk({ manifest, projectFile: target.value, preview: null, migrated: true });
};

const replaceFile = async (
  documents: DocumentsPort,
  folder: string,
  found: DocumentEntry,
  manifest: ProjectDocument,
): Promise<ProjectResult<LoadedManifest>> => {
  const written = await writeProjectFile(documents, folder, manifest);
  if (written.ok) await documents.trash(found.path);
  return written;
};

const migrateManifest = async (
  documents: DocumentsPort,
  folder: string,
  found: DocumentEntry,
  manifest: ProjectManifest,
): Promise<ProjectResult<LoadedManifest>> => {
  const plan = planMigration(manifest, { ids: browserIdSource(), sourceFileName: found.name });
  if (!plan.ok) return plan;
  const folders = resolveFolders(plan.value.manifest.folders, folder);
  if (!folders.ok) return folders;
  if (await writeMigratedFiles(documents, plan.value, folders.value, clock)) return replaceFile(documents, folder, found, plan.value.manifest);
  toast(PROJECT_TEXT.migrationKept(found.name), { variant: 'warning' });
  return writeProjectFile(documents, folder, plan.value.manifest);
};

const migrateProject = async (documents: DocumentsPort, folder: string, found: DocumentEntry): Promise<ProjectResult<LoadedManifest>> => {
  const read = readManifest(await documents.readText(found.path));
  if (!read.ok) return read;
  return read.value.version === 1
    ? migrateManifest(documents, folder, found, read.value.manifest)
    : replaceFile(documents, folder, found, read.value.manifest);
};

export { migrateProject };
