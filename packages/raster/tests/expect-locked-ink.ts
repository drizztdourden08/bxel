/* @layer tests @kind logic */
import { expect } from 'vitest';
import { heartIds, heartProject } from './heart-project';
import { pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { errorOf, expectUntouched } from './result-checks';

const expectLockedInk = (command: string, options: Record<string, unknown>): void => {
  const engine = pixelEngine(heartProject());
  const before = engine.state().project;
  const scope = scopeOf([heartIds.heartB], { by: 'ids', ids: [heartIds.ink] });
  const error = errorOf(engine.execute(request([stepOf(command, scope, options)])));
  expect(error.code).toBe('LAYER_LOCKED');
  expectUntouched(engine, before);
};

export { expectLockedInk };
