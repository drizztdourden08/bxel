/* @layer tests @kind logic */
import { expect } from 'vitest';
import { heartIds, heartArtwork } from './heart-artwork';
import { pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { errorOf, expectUntouched } from './result-checks';

const expectLockedInk = (command: string, options: Record<string, unknown>): void => {
  const engine = pixelEngine(heartArtwork());
  const before = engine.state().artwork;
  const scope = scopeOf([heartIds.heartB], { by: 'ids', ids: [heartIds.ink] });
  const error = errorOf(engine.execute(request([stepOf(command, scope, options)])));
  expect(error.code).toBe('LAYER_LOCKED');
  expectUntouched(engine, before);
};

export { expectLockedInk };
