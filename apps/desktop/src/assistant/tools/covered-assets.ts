/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { assetKeys } from '../../workspace/asset-keys';
import type { FolderCover, ToolContext } from '../assistant.type';
import { insideCover } from './inside-cover';
import { wholeCovered } from './whole-covered';

const coveredAssets = (context: ToolContext, documentId: string, cover: FolderCover): ReadonlySet<string> => {
  const view = context.host.view(documentId as DocumentId);
  if (!view || (cover.folders.length === 0 && cover.projectFiles.length === 0)) return new Set();
  const { artwork } = view.state;
  if (wholeCovered(context, documentId, cover)) {
    return new Set([...assetKeys(artwork).map((key) => key.id), ...artwork.sprites.map((sprite) => sprite.id)]);
  }
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const ids = new Set([...(workspace?.paths ?? [])].filter(([, path]) => insideCover(cover, path)).map(([id]) => id));
  const tiles = artwork.tilesets.filter((tileset) => ids.has(tileset.id)).flatMap((tileset) => tileset.tiles.map((tile) => tile.spriteId));
  const frames = artwork.animations.filter((animation) => ids.has(animation.id)).flatMap((animation) => animation.frames.flatMap((frame) => (frame.spriteId === null ? [] : [frame.spriteId])));
  const maps = artwork.tilemaps.filter((tilemap) => ids.has(tilemap.tilesetId)).map((tilemap) => tilemap.id);
  return new Set([...ids, ...tiles, ...frames, ...maps]);
};

export { coveredAssets };
