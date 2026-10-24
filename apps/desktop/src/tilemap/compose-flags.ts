/* @layer renderer-app @kind logic */
import type { CellFlags, Point } from '@bxel/document';
import { beforeTurn } from './before-turn';
import { cellSource } from './cell-source';
import { ALL_FLAGS, SAMPLE_POINTS, TURN_SAMPLE } from './flag-sets.constants';
import type { FlagOp } from './tilemap.type';

const same = (one: Point, two: Point): boolean => one.x === two.x && one.y === two.y;

const matches = (current: CellFlags, op: FlagOp, candidate: CellFlags): boolean =>
  SAMPLE_POINTS.every((at) => same(cellSource(candidate, TURN_SAMPLE, at), cellSource(current, TURN_SAMPLE, beforeTurn(op, TURN_SAMPLE, at))));

const composeFlags = (current: CellFlags, op: FlagOp): CellFlags => ALL_FLAGS.find((candidate) => matches(current, op, candidate)) ?? current;

export { composeFlags };
