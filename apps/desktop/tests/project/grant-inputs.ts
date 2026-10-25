/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';
import type { Disk } from './memory-disk';
import { ROOT } from './project-harness';
import { toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';
import { workspaceDocumentId } from './hidden-folder-rig';

type GrantRig = {
  readonly current: ToolRig;
  readonly artwork: Artwork;
  readonly paths: ReadonlyMap<string, string>;
  readonly documentId: string;
};

const grantRig = async (): Promise<GrantRig> => {
  const artwork = sampleArtwork();
  let paths: ReadonlyMap<string, string> = new Map();
  const seed = (disk: Disk): void => {
    paths = writeProjectAssets(disk, ROOT, artwork);
  };
  const current = await toolRig({ seed });
  return {
    current,
    artwork,
    paths,
    get documentId() {
      return workspaceDocumentId();
    },
  };
};

const spriteId = (rig: GrantRig, at: number): string => rig.artwork.sprites[at]?.id ?? '';

const revisionOf = (rig: GrantRig): number => rig.current.rig.kit.host.view(rig.documentId as never)?.state.revision ?? 0;

const layerEdit = (rig: GrantRig, at: number) => ({
  documentId: rig.documentId,
  baseRevision: revisionOf(rig),
  label: 'Ink',
  steps: [{ name: 'layer.add', targets: { sprites: [spriteId(rig, at)], layers: { by: 'all' }, frames: { by: 'all' } }, options: { name: 'Ink' } }],
});

const pixelsRead = (rig: GrantRig, at: number) => ({
  documentId: rig.documentId,
  spriteId: spriteId(rig, at),
  layer: 'flattened',
  rect: { x: 0, y: 0, width: 2, height: 2 },
});

const relativePath = (rig: GrantRig, id: string): string => (rig.paths.get(id) ?? '').slice(ROOT.length + 1);

export { grantRig, layerEdit, pixelsRead, relativePath, revisionOf, spriteId };
export type { GrantRig };
