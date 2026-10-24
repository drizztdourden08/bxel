/* @layer tests @kind logic */
import type { Artwork, Engine, Sprite, SpriteId, TargetScope, TransactionOk } from '@bxel/document';
import { celAt } from '../src/commands/compose/cel-at';
import { brand } from './brand';
import { buildArtwork } from './build-artwork';
import { documentId, pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { okOf } from './result-checks';
import { toRows } from './to-rows';
import { refusalOf } from './transform-checks';

const walk = brand<SpriteId>('spr_000070');
const idle = brand<SpriteId>('spr_000080');
const run = brand<SpriteId>('spr_000090');

const world = (): Artwork =>
  buildArtwork([
    {
      id: 'spr_000070',
      name: 'walk',
      width: 4,
      height: 4,
      pivot: { x2: 4, y2: 8 },
      frames: ['frm_000072', 'frm_000074'],
      layers: [{ id: 'lay_000071', name: 'Body', cels: { frm_000072: 'cel_000073', frm_000074: 'cel_000075' } }],
      cels: { cel_000073: ['1...', '.2..', '..3.', '...4'], cel_000075: ['....', '5555', '....', '6666'] },
    },
    {
      id: 'spr_000080',
      name: 'idle',
      width: 2,
      height: 2,
      frames: ['frm_000082'],
      layers: [{ id: 'lay_000081', name: 'Body', cels: { frm_000082: 'cel_000083' } }],
      cels: { cel_000083: ['12', '34'] },
    },
    {
      id: 'spr_000090',
      name: 'run',
      width: 4,
      height: 4,
      frames: ['frm_000092'],
      layers: [
        { id: 'lay_000091', name: 'Body', cels: { frm_000092: 'cel_000093' } },
        { id: 'lay_000094', name: 'Ink', cels: { frm_000092: 'cel_000095' } },
      ],
      cels: { cel_000093: ['....', '.11.', '.11.', '....'], cel_000095: ['....', '....', '....', '6...'] },
    },
  ]);

const named = (engine: Engine, name: string): Sprite => {
  const found = engine.state().artwork.sprites.find((sprite) => sprite.name === name);
  if (!found) throw new Error(`no sprite ${name}`);
  return found;
};

const names = (engine: Engine): string[] => engine.state().artwork.sprites.map((sprite) => sprite.name);

const frameRows = (sprite: Sprite, layer: number, frame: number): string[] => {
  const held = sprite.layers[layer];
  const cel = held ? celAt(sprite, held, sprite.frames[frame]?.id) : undefined;
  if (!cel) throw new Error('no cel');
  return toRows({ pixels: cel.pixels, width: sprite.width, height: sprite.height });
};

const fresh = (clock?: () => number): Engine => pixelEngine(world(), clock);

const apply = (engine: Engine, name: string, targets: TargetScope | null, options: unknown): TransactionOk =>
  okOf(engine.execute(request([stepOf(name, targets as TargetScope, options)], { baseRevision: engine.state().revision })));

const applyTo = (engine: Engine, name: string, ids: readonly SpriteId[], options: unknown): TransactionOk =>
  apply(engine, name, scopeOf(ids), options);

const refusal = (engine: Engine, name: string, ids: readonly SpriteId[], options: unknown): string =>
  refusalOf(engine, stepOf(name, scopeOf(ids), options)).code;

const undoLast = (engine: Engine): void => {
  okOf(engine.undo({ documentId, expectedRevision: engine.state().revision }));
};

const onSheet = (engine: Engine, members: readonly SpriteId[]): void => {
  apply(engine, 'sheet.create', null, { name: 'Main' });
  const sheet = engine.state().artwork.sheets[0];
  if (!sheet) throw new Error('no sheet');
  applyTo(engine, 'sheet.add', members, { sheet: sheet.id });
};

const heldNames = (engine: Engine): (string | undefined)[] =>
  (engine.state().artwork.sheets[0]?.entries ?? []).map((entry) => engine.state().artwork.sprites.find((sprite) => sprite.id === entry.spriteId)?.name);

export { applyTo, frameRows, fresh, heldNames, idle, named, names, onSheet, refusal, run, undoLast, walk };
