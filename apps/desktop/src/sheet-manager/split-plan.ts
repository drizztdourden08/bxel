/* @layer renderer-app @kind logic */
import { expandNamePattern } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { COMPOSE_TEXT } from './compose-text.constants';
import type { PiecePlan, SplitSpec } from './compose.type';
import { pieceError } from './piece-error';

const splitPlan = (spec: SplitSpec, sources: readonly Sprite[], others: readonly string[]): PiecePlan => {
  const names = sources.flatMap((sprite) =>
    sprite.frames.map((_frame, at) => expandNamePattern(spec.pattern, sprite.name, spec.start + at).trim()),
  );
  return { names, error: names.length === 0 ? COMPOSE_TEXT.nothingToSplit : pieceError(names, others) };
};

export { splitPlan };
