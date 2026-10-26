/* @layer renderer-app @kind logic */
import { artworkCreate, COMMAND_NAME, counterIdSource, createEngine, documentCommands, splitAnimatedSprites } from '@bxel/document';
import type { Artwork, Engine, SpriteId, TargetScope } from '@bxel/document';
import { ANIMATION_COLORS } from './animation.constants';
import { GALLERY } from './gallery.constants';
import { runStep } from './run-step';

const frameScope = (sprite: SpriteId, frameAt: number | null, engine: Engine): TargetScope => {
  const found = engine.state().artwork.sprites.find((each) => each.id === sprite);
  const frame = frameAt === null ? undefined : found?.frames[frameAt];
  return { sprites: [sprite], layers: { by: 'all' }, frames: frame ? { by: 'ids', ids: [frame.id] } : { by: 'all' } };
};

const faceOf = (side: number, eyeShift: number, tone: number): Uint8Array => {
  const pixels = new Uint8Array(side * side);
  const middle = (side - 1) / 2;
  for (let y = 0; y < side; y += 1) {
    for (let x = 0; x < side; x += 1) {
      const reach = Math.hypot(x - middle, y - middle);
      if (reach <= middle) pixels[y * side + x] = reach > middle - 1.2 ? GALLERY.ring : tone;
    }
  }
  for (const eye of [GALLERY.eyes.left, GALLERY.eyes.right]) pixels[GALLERY.eyes.row * side + eye + eyeShift] = GALLERY.eyeTone;
  return pixels;
};

const paint = (engine: Engine, sprite: SpriteId, frameAt: number, pixels: Uint8Array): void => {
  const rect = { x: 0, y: 0, width: GALLERY.side, height: GALLERY.side };
  runStep(engine, COMMAND_NAME.pixelsPatch, { rect, pixels, skipZero: false }, frameScope(sprite, frameAt, engine));
};

const paintTile = (engine: Engine, at: number, tone: number): void => {
  const tile = engine.state().artwork.tilesets[0]?.tiles[at];
  if (!tile) throw new Error(`no tile ${at}`);
  const size = GALLERY.tile;
  const pixels = new Uint8Array(size * size).fill(tone);
  runStep(engine, COMMAND_NAME.pixelsPatch, { rect: { x: 0, y: 0, width: size, height: size }, pixels, skipZero: false }, frameScope(tile.spriteId, null, engine));
};

const buildMap = (engine: Engine): void => {
  runStep(engine, COMMAND_NAME.tilesetCreate, { name: GALLERY.tileset, tileWidth: GALLERY.tile, tileHeight: GALLERY.tile });
  const tileset = engine.state().artwork.tilesets[0];
  if (!tileset) throw new Error('no tileset');
  runStep(engine, COMMAND_NAME.tileAdd, { tileset: tileset.id });
  runStep(engine, COMMAND_NAME.tileAdd, { tileset: tileset.id });
  paintTile(engine, 0, GALLERY.tones.grass);
  paintTile(engine, 1, GALLERY.tones.stone);
  runStep(engine, COMMAND_NAME.tilemapCreate, { name: GALLERY.map, tileset: tileset.id, columns: GALLERY.columns, rows: GALLERY.rows });
  const map = engine.state().artwork.tilemaps[0];
  const layer = map?.layers[0];
  const stone = engine.state().artwork.tilesets[0]?.tiles[1];
  if (!map || !layer || !stone) throw new Error('no map');
  const base = { tilemap: map.id, layer: { by: 'id', id: layer.id }, flags: { flipX: false, flipY: false, diagonal: false } };
  runStep(engine, COMMAND_NAME.mapRect, { ...base, rect: { x: 0, y: 0, width: GALLERY.columns, height: GALLERY.rows }, tile: 1 });
  runStep(engine, COMMAND_NAME.mapRect, { ...base, rect: { x: 2, y: 1, width: 3, height: 2 }, tile: stone.key });
};

const buildGalleryArtwork = (): Artwork => {
  const ids = counterIdSource();
  const created = artworkCreate({
    options: { name: GALLERY.project, bank: { name: GALLERY.palette, cap: 16, transparent: true, colors: ANIMATION_COLORS }, sprite: { name: GALLERY.sprites[0], width: GALLERY.side, height: GALLERY.side } },
    ids,
  });
  if (!created.ok) throw new Error(created.error.message);
  const engine = createEngine({ state: created.state, ids, commands: documentCommands });
  const hero = engine.state().artwork.sprites[0];
  if (!hero) throw new Error('no hero');
  runStep(engine, COMMAND_NAME.frameAdd, { durationMs: GALLERY.frameMs }, frameScope(hero.id, null, engine));
  paint(engine, hero.id, 0, faceOf(GALLERY.side, 0, GALLERY.tones.skin));
  paint(engine, hero.id, 1, faceOf(GALLERY.side, 1, GALLERY.tones.skin));
  runStep(engine, COMMAND_NAME.spriteCreate, { name: GALLERY.sprites[1], width: GALLERY.side, height: GALLERY.side });
  const slime = engine.state().artwork.sprites.find((each) => each.name === GALLERY.sprites[1]);
  if (!slime) throw new Error('no slime');
  paint(engine, slime.id, 0, faceOf(GALLERY.side, 0, GALLERY.tones.slime));
  runStep(engine, COMMAND_NAME.sheetCreate, { name: GALLERY.sheet });
  const sheet = engine.state().artwork.sheets[0];
  const both = { sprites: engine.state().artwork.sprites.map((each) => each.id), layers: { by: 'all' }, frames: { by: 'all' } } satisfies TargetScope;
  runStep(engine, COMMAND_NAME.sheetAdd, { sheet: sheet?.id }, both);
  buildMap(engine);
  return splitAnimatedSprites(engine.state().artwork, new Map(), counterIdSource(GALLERY.splitIds)).artwork;
};

export { buildGalleryArtwork };
