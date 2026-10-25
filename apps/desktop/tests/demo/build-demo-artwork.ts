/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep, Engine, FrameId, SpriteRef, TargetScope } from '@bxel/document';
import { applyDemoSteps } from './apply-demo-steps';
import { artPixels } from './art-pixels';
import { FRAME_MS, HERO_FRAMES, MAP_ROWS, SIDE, SLIME_ROWS, TILE_ROWS, TILE_SIDE } from './demo-art.constants';
import { startDemoEngine } from './start-demo-engine';

const onSprite = (sprite: SpriteRef): TargetScope => ({ sprites: [sprite], layers: { by: 'all' }, frames: { by: 'all' } });

const onFrame = (sprite: SpriteRef, frame: FrameId): TargetScope => ({ sprites: [sprite], layers: { by: 'all' }, frames: { by: 'ids', ids: [frame] } });

const patch = (targets: TargetScope, rows: readonly string[], side: number): CommandStep => ({
  name: COMMAND_NAME.pixelsPatch,
  targets,
  options: { rect: { x: 0, y: 0, width: side, height: side }, pixels: artPixels(rows, side, side), skipZero: false },
});

const heroOf = (engine: Engine) => {
  const found = engine.state().artwork.sprites[0];
  if (!found) throw new Error('The demo has no hero.');
  return found;
};

const buildHero = (engine: Engine): void => {
  const all = onSprite(heroOf(engine).id);
  applyDemoSteps(engine, 'Frames', [
    { name: COMMAND_NAME.frameAdd, targets: all, options: { durationMs: FRAME_MS[1] } },
    { name: COMMAND_NAME.frameAdd, targets: all, options: { durationMs: FRAME_MS[2] } },
    { name: COMMAND_NAME.frameUpdate, targets: all, options: { frame: { by: 'index', index: 0 }, durationMs: FRAME_MS[0] } },
  ]);
  const hero = heroOf(engine);
  applyDemoSteps(engine, 'Hero art', hero.frames.map((frame, at) => patch(onFrame(hero.id, frame.id), HERO_FRAMES[at] ?? [], SIDE)));
  applyDemoSteps(engine, 'Walk tag', [
    { name: COMMAND_NAME.tagAdd, targets: all, options: { name: 'walk', from: { by: 'index', index: 0 }, to: { by: 'index', index: 2 } } },
  ]);
};

const buildSheet = (engine: Engine): void => {
  applyDemoSteps(engine, 'Slime', [
    { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'slime', width: SIDE, height: SIDE }, ref: 'slime' },
    patch(onSprite({ ref: 'slime' }), SLIME_ROWS, SIDE),
    { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: 'party' }, ref: 'party' },
  ]);
  const everyone: TargetScope = { sprites: engine.state().artwork.sprites.map((sprite) => sprite.id), layers: { by: 'all' }, frames: { by: 'all' } };
  const sheet = engine.state().artwork.sheets[0];
  applyDemoSteps(engine, 'Sheet sprites', [{ name: COMMAND_NAME.sheetAdd, targets: everyone, options: { sheet: sheet?.id } }]);
};

const tileStep = (key: string, name: string): CommandStep => ({ name: COMMAND_NAME.tileAdd, targets: null, options: { tileset: { ref: 'ground' }, name }, ref: key });

const buildGround = (engine: Engine): void => {
  applyDemoSteps(engine, 'Tileset', [
    { name: COMMAND_NAME.tilesetCreate, targets: null, options: { name: 'ground', tileWidth: TILE_SIDE, tileHeight: TILE_SIDE }, ref: 'ground' },
    tileStep('grass', 'Grass'),
    tileStep('dirt', 'Dirt'),
    tileStep('water', 'Water'),
    patch(onSprite({ ref: 'grass' }), TILE_ROWS.grass, TILE_SIDE),
    patch(onSprite({ ref: 'dirt' }), TILE_ROWS.dirt, TILE_SIDE),
    patch(onSprite({ ref: 'water' }), TILE_ROWS.water, TILE_SIDE),
    { name: COMMAND_NAME.tilemapCreate, targets: null, options: { name: 'meadow', tileset: { ref: 'ground' }, columns: 12, rows: 8, layerName: 'Ground' }, ref: 'meadow' },
    {
      name: COMMAND_NAME.mapWrite,
      targets: null,
      options: { tilemap: { ref: 'meadow' }, layer: { by: 'name', name: 'Ground' }, rect: { x: 0, y: 0, width: 12, height: 8 }, keys: MAP_ROWS.flatMap((row) => [...row].map(Number)) },
    },
  ]);
};

const buildDemoArtwork = (): Artwork => {
  const engine = startDemoEngine();
  buildHero(engine);
  buildSheet(engine);
  buildGround(engine);
  return engine.state().artwork;
};

export { buildDemoArtwork };
