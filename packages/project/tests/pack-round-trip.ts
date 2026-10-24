/* @layer tests @kind test */
import { decodeProject, encodeProject, packProject, resolveFolders, unpackProject } from '@bxel/project';
import type { FolderLocation, UnpackPlan } from '@bxel/project';
import { must } from './must';
import { sampleDocument } from './sample-document';

type RoundTrip = {
  readonly unpack: UnpackPlan;
  readonly rebuilt: ReadonlyMap<string, Uint8Array>;
  readonly orphans: readonly string[];
};

const locationOf = (key: string): FolderLocation => {
  const at = key.indexOf('/');
  return { folderId: key.slice(0, at) as FolderLocation['folderId'], path: key.slice(at + 1) };
};

const packAll = (files: ReadonlyMap<string, Uint8Array>): Uint8Array => {
  const plan = must(packProject(sampleDocument(), [...files.keys()].map((key) => locationOf(key))));
  const assets = new Map<string, Uint8Array>();
  for (const operation of plan.operations) {
    assets.set(operation.entry, files.get(`${operation.from.folderId}/${operation.from.path}`) ?? new Uint8Array());
  }
  return must(encodeProject({ manifest: plan.manifest, preview: null, assets }, () => 0));
};

const applyOperations = (unpack: UnpackPlan, assets: ReadonlyMap<string, Uint8Array>) => {
  const disk = new Map<string, Uint8Array | null>();
  const orphans: string[] = [];
  for (const operation of unpack.operations) {
    const parent = operation.path.slice(0, operation.path.lastIndexOf('/'));
    if (operation.kind === 'extract' && !disk.has(parent)) orphans.push(operation.path);
    disk.set(operation.path, operation.kind === 'extract' ? (assets.get(operation.entry) ?? null) : null);
  }
  return { disk, orphans };
};

const rebuildTree = (unpack: UnpackPlan, disk: ReadonlyMap<string, Uint8Array | null>): Map<string, Uint8Array> => {
  const rebuilt = new Map<string, Uint8Array>();
  for (const folder of must(resolveFolders(unpack.manifest.folders, unpack.root))) {
    for (const [path, content] of disk) {
      if (content !== null && path.startsWith(`${folder.path}/`)) {
        rebuilt.set(`${folder.folderId}/${path.slice(folder.path.length + 1)}`, content);
      }
    }
  }
  return rebuilt;
};

const roundTrip = (files: ReadonlyMap<string, Uint8Array>, destination: string): RoundTrip => {
  const decoded = must(decodeProject(packAll(files)));
  const unpack = must(unpackProject(decoded.manifest, [...decoded.assets.keys()], destination));
  const { disk, orphans } = applyOperations(unpack, decoded.assets);
  return { unpack, rebuilt: rebuildTree(unpack, disk), orphans };
};

export { roundTrip };
