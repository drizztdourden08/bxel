/* @layer tests @kind logic */
import { findSprite } from '@bxel/document';
import type { CelId, CommandError, CommandStep, Engine, SpriteId, TargetScope, TransactionOk } from '@bxel/document';
import { request, stepOf } from './pixel-engine';
import { celRows, errorOf, expectUntouched, okOf } from './result-checks';

const dimsOf = (engine: Engine, id: SpriteId) => {
  const sprite = findSprite(engine.state().project, id);
  return { width: sprite?.width, height: sprite?.height, pivot: sprite?.pivot };
};

const snapshotOf = (engine: Engine, id: SpriteId) => {
  const cels = Object.values(findSprite(engine.state().project, id)?.cels ?? {});
  return { ...dimsOf(engine, id), cels: cels.map((cel) => [cel.id, [...cel.pixels]] as const) };
};

const rowsOf = (engine: Engine, id: SpriteId, cel: CelId): string[] => celRows(engine.state().project, id, cel);

const applyStep = (engine: Engine, name: string, scope: TargetScope, options: unknown): TransactionOk =>
  okOf(engine.execute(request([stepOf(name, scope, options)])));

const applySteps = (engine: Engine, steps: readonly CommandStep[]): TransactionOk => okOf(engine.execute(request(steps)));

const previewOf = (engine: Engine, step: CommandStep): TransactionOk =>
  okOf(engine.execute(request([step], { mode: 'preview', previewPixels: 4096 })));

const refusalOf = (engine: Engine, step: CommandStep): CommandError => {
  const before = engine.state().project;
  const error = errorOf(engine.execute(request([step])));
  expectUntouched(engine, before);
  return error;
};

export { applyStep, applySteps, dimsOf, previewOf, refusalOf, rowsOf, snapshotOf };
