/* @layer renderer-app @kind logic */
import { counterIdSource, splitAnimatedSprites, splitIntoAssets } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { createFolderId, createProjectDocument, createProjectId, encodeProject } from '@bxel/project';
import { encodeAsset } from '../../src/workspace/encode-asset';
import { PROJECT_FILE_SUFFIX } from '../../src/project/project.constants';
import { DEMO_NAME } from './demo-art.constants';

const idBytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, at) => at + 21);

const demoFiles = (made: Artwork): ReadonlyMap<string, Uint8Array> => {
  const artwork = splitAnimatedSprites(made, new Map(), counterIdSource(5000)).artwork;
  const plan = splitIntoAssets(artwork);
  const paths = new Map(plan.files.map((file) => [file.key.id, `/${file.path}`] as const));
  const files = new Map<string, Uint8Array>();
  for (const file of plan.files) files.set(file.path, encodeAsset(artwork, file.key, paths, { preview: null, clock: () => 0 }));
  const manifest = createProjectDocument({ projectId: createProjectId(idBytes), folderId: createFolderId(idBytes), name: DEMO_NAME });
  const encoded = encodeProject({ manifest, preview: null, assets: new Map() }, () => 0);
  if (!encoded.ok) throw new Error(encoded.message);
  files.set(`${DEMO_NAME}${PROJECT_FILE_SUFFIX}`, encoded.value);
  return files;
};

export { demoFiles };
