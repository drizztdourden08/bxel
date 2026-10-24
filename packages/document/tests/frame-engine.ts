/* @layer core @kind test */
import { counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { CommandStep, Engine, FrameId, FrameSelector, LayerSelector, SpriteId } from '@bxel/document';
import { brand, fixtureToArtwork } from './fixture-to-artwork';
import { documentId } from './heart-engine';
import { frameFixture } from './frame-fixture';
import { sprite } from './layer-engine';

const WALKER = brand<SpriteId>('spr_000100');
const SINGLE = brand<SpriteId>('spr_000200');

const FRAME = [
  brand<FrameId>('frm_000110'),
  brand<FrameId>('frm_000111'),
  brand<FrameId>('frm_000112'),
  brand<FrameId>('frm_000113'),
] as const;

const frameEngine = (): Engine =>
  createEngine({
    state: { documentId, revision: 1, artwork: fixtureToArtwork(frameFixture), readOnly: false },
    ids: counterIdSource(500),
    commands: documentCommands,
  });

const byIndex = (index: number) => ({ by: 'index', index }) as const;
const byId = (id: string) => ({ by: 'id', id }) as const;
const named = (name: string) => ({ by: 'name', name }) as const;

const scopedStep = (
  name: string,
  options: unknown,
  scope: { layers: LayerSelector; frames: FrameSelector },
  sprites: readonly SpriteId[] = [WALKER],
): CommandStep => ({ name, targets: { sprites, ...scope }, options });

const frameIds = (engine: Engine, id: SpriteId = WALKER): string[] => sprite(engine, id).frames.map((frame) => frame.id);

const tagSpans = (engine: Engine): string[] =>
  sprite(engine).tags.map((tag) => `${tag.name}:${tag.from}-${tag.to}`);

const celAt = (engine: Engine, layer: string, frame: string, id: SpriteId = WALKER): string | undefined =>
  sprite(engine, id).layers.find((item) => item.name === layer)?.cels[frame as FrameId];

const patchOptions = (value: number, extra: Record<string, unknown> = {}) => ({
  rect: { x: 3, y: 3, width: 1, height: 1 },
  pixels: new Uint8Array([value]),
  ...extra,
});

export { FRAME, SINGLE, WALKER, byId, byIndex, celAt, frameEngine, frameIds, named, patchOptions, scopedStep, tagSpans };
