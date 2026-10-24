/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { relativeInside } from '@bxel/project';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { assetKeys } from '../../workspace/asset-keys';
import type { ToolContext } from '../assistant.type';
import { hiddenFolderPaths } from './hidden-folder-paths';

const hiddenAssets = (context: ToolContext, documentId: string): ReadonlySet<string> => {
  const view = context.host.view(documentId as DocumentId);
  const folders = hiddenFolderPaths();
  if (!view || folders.length === 0) return new Set();
  const inside = (path: string | undefined): boolean => path !== undefined && folders.some((folder) => relativeInside(folder, path) !== undefined);
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const { artwork } = view.state;
  if (inside(context.paths.pathOf(documentId as DocumentId)) || inside(workspace?.legacy?.path)) {
    return new Set([...assetKeys(artwork).map((key) => key.id), ...artwork.sprites.map((sprite) => sprite.id)]);
  }
  const ids = new Set([...(workspace?.paths ?? [])].filter(([, path]) => inside(path)).map(([id]) => id));
  const tiles = artwork.tilesets.filter((tileset) => ids.has(tileset.id)).flatMap((tileset) => tileset.tiles.map((tile) => tile.spriteId));
  const maps = artwork.tilemaps.filter((tilemap) => ids.has(tilemap.tilesetId)).map((tilemap) => tilemap.id);
  return new Set([...ids, ...tiles, ...maps]);
};

export { hiddenAssets };
