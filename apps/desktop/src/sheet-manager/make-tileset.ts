/* @layer renderer-app @kind logic */
import { COMMAND_NAME, findSprite, flattenFrame } from '@bxel/document';
import type { Artwork, AssetKey, CommandStep, Sprite, SpriteId } from '@bxel/document';
import { openCreatedAsset } from '../new-sprite/open-created-asset';
import { currentArtwork } from '../sheet/current-artwork';
import { freeName } from '../sheet/free-name';
import { runDocument } from '../sheet/run-document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { TILE_SET_REF, TILESET_TEXT } from './tileset-text.constants';

/** Why these sprites cannot make a tileset, or null: it needs at least one, all one size and one palette. */
const tilesetBlocker = (sprites: readonly Sprite[]): string | null => {
  const [first] = sprites;
  if (!first) return TILESET_TEXT.needSprites;
  if (sprites.some((sprite) => sprite.width !== first.width || sprite.height !== first.height)) return TILESET_TEXT.sameSize;
  if (sprites.some((sprite) => sprite.bankId !== first.bankId)) return TILESET_TEXT.samePalette;
  return null;
};

const tileSteps = (artwork: Artwork, sprites: readonly Sprite[]): CommandStep[] =>
  sprites.flatMap((sprite, index): CommandStep[] => {
    const frame = sprite.frames[0];
    const ref = `${TILE_SET_REF}.tile${index}`;
    if (!frame) return [];
    return [
      { name: COMMAND_NAME.tileAdd, targets: null, options: { tileset: { ref: TILE_SET_REF } }, ref },
      {
        name: COMMAND_NAME.pixelsPatch,
        targets: { sprites: [{ ref }], layers: { by: 'all' as const }, frames: { by: 'all' as const } },
        options: { rect: { x: 0, y: 0, width: sprite.width, height: sprite.height }, pixels: flattenFrame(sprite, frame.id), skipZero: false },
      },
    ];
  });

const makeTileset = async (ids: readonly SpriteId[]): Promise<boolean> => {
  const artwork = currentArtwork();
  const documentId = useDocumentStore.getState().activeId;
  if (!artwork || documentId === null) return false;
  const sprites = ids.flatMap((id) => findSprite(artwork, id) ?? []);
  const [first] = sprites;
  if (!first || tilesetBlocker(sprites) !== null) return false;
  const name = freeName(TILESET_TEXT.name, artwork.tilesets.map((tileset) => tileset.name));
  const create: CommandStep = {
    name: COMMAND_NAME.tilesetCreate,
    targets: null,
    options: { name, tileWidth: first.width, tileHeight: first.height, bankId: first.bankId },
    ref: TILE_SET_REF,
  };
  const done = runDocument(TILESET_TEXT.label(sprites.length), [create, ...tileSteps(artwork, sprites)]);
  const id = done?.created[TILE_SET_REF];
  if (id === undefined) return false;
  const key: AssetKey = { kind: 'tileset', id };
  await openCreatedAsset(documentId, key);
  return true;
};

export { makeTileset, tilesetBlocker };
