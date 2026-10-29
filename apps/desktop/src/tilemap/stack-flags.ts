/* @layer renderer-app @kind logic */
import type { CellFlags, Point } from '@bxel/document';
import { cellSource } from './cell-source';
import { ALL_FLAGS, SAMPLE_POINTS, TURN_SAMPLE } from './flag-sets.constants';

const same = (one: Point, two: Point): boolean => one.x === two.x && one.y === two.y;

const stackFlags = (own: CellFlags, outer: CellFlags): CellFlags =>
  ALL_FLAGS.find((candidate) =>
    SAMPLE_POINTS.every((at) => same(cellSource(candidate, TURN_SAMPLE, at), cellSource(own, TURN_SAMPLE, cellSource(outer, TURN_SAMPLE, at)))),
  ) ?? own;

export { stackFlags };
