/* @layer renderer-app @kind logic */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { splitIntoAssets } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { createFolderId, createProjectDocument, createProjectId, encodeProject } from '@bxel/project';
import { encodeAsset } from '../../../src/workspace/encode-asset';

const idBytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, at) => at + 3);

const writeSampleProject = async (root: string, artwork: Artwork, name: string): Promise<ReadonlyMap<string, string>> => {
  const plan = splitIntoAssets(artwork);
  const base = root.replaceAll('\\', '/');
  const paths = new Map(plan.files.map((file) => [file.key.id, `${base}/${file.path}`] as const));
  for (const file of plan.files) {
    const path = paths.get(file.key.id) ?? '';
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, encodeAsset(artwork, file.key, paths, { preview: null, clock: () => 0 }));
  }
  const manifest = createProjectDocument({ projectId: createProjectId(idBytes), folderId: createFolderId(idBytes), name });
  const encoded = encodeProject({ manifest, preview: null, assets: new Map() }, () => 0);
  if (!encoded.ok) throw new Error(encoded.message);
  await mkdir(`${base}/exports`, { recursive: true });
  await writeFile(`${base}/${name}.bxproject`, encoded.value);
  return paths;
};

export { writeSampleProject };
