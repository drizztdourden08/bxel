/* @layer renderer-app @kind logic */
import { findTile } from '@bxel/document';
import type { AssetKey, SheetId, SpriteId, TilemapId, TilesetId } from '@bxel/document';
import { useManagerStore } from '../stores/useManagerStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentTileset } from '../tilemap/current-tileset';
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

const editFirstTile = (): void => {
  const maps = useTilemapStore.getState();
  const tileset = currentTileset();
  const wanted = maps.stamp.keys.find((key) => key !== 0);
  const tile = tileset ? (findTile(tileset, wanted ?? -1) ?? tileset.tiles[0]) : undefined;
  if (tile) maps.editTile(tile.key, tile.spriteId);
  else maps.placeTiles();
};

const showTileset = (tilesetId: string): void => {
  showMap(null, tilesetId);
  editFirstTile();
};

const shown: { kind: AssetKey['kind'] | null } = { kind: null };

const showTilemap = (tilemapId: string): void => {
  showMap(tilemapId, null);
  if (shown.kind === 'tileset') useTilemapStore.getState().placeTiles();
};

const showAsset = (key: AssetKey): void => {
  if (key.kind === 'sprite') showSprite(key.id);
  else if (key.kind === 'animation' || key.kind === 'palette') showSprite(undefined);
  else if (key.kind === 'tilemap') showTilemap(key.id);
  else if (key.kind === 'tileset') showTileset(key.id);
  else if (key.kind === 'sheet') {
    useSpriteStore.getState().setMode('sheet', false);
    useManagerStore.getState().patch({ sheetId: key.id as SheetId });
  }
  shown.kind = key.kind;
};

export { showAsset };
