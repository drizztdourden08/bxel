/* @layer renderer-app @kind bench */
import { COMMAND_NAME } from '@bxel/document';
import { bench, describe } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { activeTarget } from '../../src/editor/active-target';
import { beginStroke } from '../../src/editor/begin-stroke';
import { createOverlay } from '../../src/editor/create-overlay';
import type { BrushOptions } from '../../src/editor/editor.type';
import { extendStroke } from '../../src/editor/extend-stroke';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';

const SIDE = 2048;
const HEAVY = { iterations: 60, time: 0, warmupIterations: 30, warmupTime: 0 };
const LIGHT = { iterations: 10, time: 0, warmupIterations: 3, warmupTime: 0 };
const OPTIONS: BrushOptions = { brush: { shape: 'circle', size: 4 }, pixelPerfect: false, symmetry: {} };

const { host } = useDocumentStore.getState();
const documentId = createDefaultArtwork(host);
const made = runSteps(host, documentId, 'Make', [{ name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'big', width: SIDE, height: SIDE } }]);
if (!made.ok) throw new Error(made.error.message);
const spriteId = host.view(documentId)?.state.artwork.sprites.find((sprite) => sprite.name === 'big')?.id ?? null;
const target = activeTarget(host.view(documentId), null, spriteId);
if (!target) throw new Error('no target');

const session = beginStroke({ target, tool: 'pencil', index: 2, options: OPTIONS, at: { x: 100, y: 100 } });
let step = 0;

describe('live stroke, 2048 sprite', () => {
  bench('press: build the overlay (target 40 ms)', () => {
    createOverlay(target);
  }, LIGHT);
  bench('one pointer move: paint and refresh pixels (target 1 ms)', () => {
    step += 1;
    extendStroke(session, { x: 100 + (step % 900), y: 100 + ((step * 7) % 900) });
  }, HEAVY);
});
