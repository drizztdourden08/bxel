/* @layer renderer-app @kind logic */
import { fileSafeStem, splitIntoAssets } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { createFolderId, createProjectDocument, createProjectId, encodeProject, PATH_LIMITS } from '@bxel/project';
import type { FileKit } from '../files/files.type';
import { manifestForSplit } from '../project-meta/manifest-for-split';
import { makeSubfolders } from '../project/make-subfolders';
import { PROJECT_FILE_SUFFIX } from '../project/project.constants';
import { randomBytes } from '../swatch-library/random-bytes';
import { roleDirs } from './role-dirs';
import { splitPaths } from './split-paths';
import { toSlashes } from './to-slashes';
import { uniquePath } from './unique-path';
import { NAME_FALLBACK } from './workspace.constants';
import { writeSplit } from './write-split';

const freeFolder = async (kit: FileKit, parent: string, stem: string): Promise<string> => {
  const listing = await kit.documents.list(parent).catch(() => ({ entries: [] }));
  return uniquePath(toSlashes(parent).replace(/\/+$/, ''), stem, '', new Set(listing.entries.map((entry) => toSlashes(entry.path).toLowerCase())));
};

const splitBeside = async (kit: FileKit, artwork: Artwork, parent: string): Promise<string> => {
  const name = fileSafeStem(artwork.name, NAME_FALLBACK).slice(0, PATH_LIMITS.maxProjectName).trim() || NAME_FALLBACK;
  const root = await freeFolder(kit, parent, name);
  const seed = createProjectDocument({ projectId: createProjectId(randomBytes), folderId: createFolderId(randomBytes), name });
  await kit.documents.mkdir(root, { recursive: true });
  await makeSubfolders(kit.documents, root, seed);
  const folder = seed.folders[0];
  const plan = splitIntoAssets(artwork);
  const paths = folder ? await splitPaths(kit.documents, plan, roleDirs(folder, root)) : new Map<string, string>();
  await writeSplit(kit, artwork, plan, paths);
  const manifest = folder ? manifestForSplit(seed, { artwork, paths, folders: [{ folderId: folder.folderId, name, path: root }] }) : seed;
  const bytes = encodeProject({ manifest, preview: null, assets: new Map() }, kit.clock);
  if (!bytes.ok) throw new Error(bytes.message);
  await kit.documents.write(`${root}/${name}${PROJECT_FILE_SUFFIX}`, bytes.value, { recent: false });
  return root;
};

export { splitBeside };
