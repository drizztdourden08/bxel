/* @layer renderer-app @kind test */
import type { CommandStep } from '@bxel/document';
import { commitSteps, harness } from './export-harness';
import type { ExportHarness } from './export-harness';

type Created = Readonly<Record<string, string>>;

type WalkWorld = ExportHarness & { readonly animation: string };

const FRAME_SPRITES = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8];

const stepOf = (name: string, options: unknown, ref?: string): CommandStep => ({
  name,
  targets: null,
  options,
  ...(ref === undefined ? {} : { ref }),
});

const spriteStep = (name: string, options: unknown, sprite: string): CommandStep => ({
  name,
  targets: { sprites: [{ ref: sprite }], layers: { by: 'all' }, frames: { by: 'all' } },
  options,
});

const run = (h: ExportHarness, steps: readonly CommandStep[]): Created => commitSteps(h, 'Test edit', steps);

const grid = (width: number, height: number, points: readonly (readonly [number, number, number])[]) => {
  const pixels = new Uint8Array(width * height);
  for (const [x, y, index] of points) pixels[y * width + x] = index;
  return { rect: { x: 0, y: 0, width, height }, pixels };
};

const walkSprites = (): CommandStep[] =>
  Array.from({ length: 9 }, (_, i) => i).flatMap((i) => [
    stepOf('sprite.create', { name: `pose${i}`, width: 4, height: 4 }, `p${i}`),
    spriteStep('pixels.patch', grid(4, 4, [[0, i % 4, i + 2], [1, 1, 3], [0, 0, 7]]), `p${i}`),
  ]);

const walkWorld = (): WalkWorld => {
  const h = harness();
  run(h, walkSprites());
  const created = run(h, [stepOf('animation.create', { name: 'walk', source: { kind: 'blank', width: 4, height: 4 } }, 'anim')]);
  const animation = created['anim'] ?? '';
  run(h, [
    stepOf('animation.directions', {
      animation,
      mode: 'eight',
      tag: 'walk',
      framesPerFacing: 2,
      mirrored: ['w', 'sw', 'nw'],
      durationMs: 100,
    }),
  ]);
  const view = h.host.view(h.documentId);
  const sprites = view?.state.artwork.sprites.filter((sprite) => sprite.name.startsWith('pose')) ?? [];
  run(
    h,
    FRAME_SPRITES.map((pose, index) =>
      stepOf('animation.frame.update', { animation, frame: { by: 'index', index }, sprite: sprites[pose]?.id }),
    ),
  );
  return { ...h, animation };
};

export { grid, run, spriteStep, stepOf, walkWorld };
export type { WalkWorld };
