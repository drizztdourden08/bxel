/* @layer renderer-app @kind logic */
import type { AssetKey, SheetId, SpriteId, TilemapId, TilesetId } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useManagerStore } from '../stores/useManagerStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { settleMapTool } from '../tilemap/settle-map-tool';

const showSprite = (spriteId: string | undefined): void => {
  const sprites = useSpriteStore.getState();
  if (sprites.mode !== 'sprite') sprites.setMode('sprite', false);
  if (spriteId === undefined) return;
  sprites.setActive(spriteId as SpriteId);
  sprites.setSelection([spriteId as SpriteId], spriteId as SpriteId);
};

const showMap = (tilemapId: string | null, tilesetId: string | null): void => {
  if (useSpriteStore.getState().mode !== 'tilemap') useSpriteStore.getState().setMode('tilemap', false);
  settleMapTool();
  const maps = useTilemapStore.getState();
  if (tilesetId !== null) maps.setTileset(tilesetId as TilesetId);
  if (tilemapId !== null) maps.setMap(tilemapId as TilemapId);
};

const paletteUser = (bankId: string): string | undefined => {
  const { activeId, views } = useDocumentStore.getState();
  const artwork = activeId === null ? undefined : views[activeId]?.state.artwork;
  return artwork?.sprites.find((sprite) => sprite.role === 'sprite' && sprite.bankId === bankId)?.id;
};

const showAsset = (key: AssetKey): void => {
  if (key.kind === 'sprite') showSprite(key.id);
  else if (key.kind === 'palette') showSprite(paletteUser(key.id));
  else if (key.kind === 'tilemap') showMap(key.id, null);
  else if (key.kind === 'tileset') showMap(null, key.id);
  else if (key.kind === 'sheet') {
    useSpriteStore.getState().setMode('sheet', false);
    useManagerStore.getState().patch({ sheetId: key.id as SheetId });
  }
};

export { showAsset };
