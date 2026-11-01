/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { alignPlan } from '../../sheet-manager/align-plan';
import type { IslandMove } from './distribute-plan.type';
import type { MaskIsland } from './mask-islands.type';

const startOf = (offset: Point, horizontal: boolean): number => (horizontal ? offset.x : offset.y);

const safeOrder = (moves: readonly IslandMove[], horizontal: boolean): IslandMove[] => {
  const forward = moves.filter((move) => startOf(move.offset, horizontal) > 0);
  const backward = moves.filter((move) => startOf(move.offset, horizontal) < 0);
  const position = (move: IslandMove): number => startOf(move.island.box, horizontal);
  return [...forward.sort((a, b) => position(b) - position(a)), ...backward.sort((a, b) => position(a) - position(b))];
};

const distributePlan = (islands: readonly MaskIsland[], horizontal: boolean): IslandMove[] => {
  const boxes = islands.map((island, index) => ({ id: String(index), ...island.box }));
  const moves = alignPlan(boxes, horizontal ? 'horizontal' : 'vertical');
  const planned = moves.flatMap((move): IslandMove[] => {
    const island = islands[Number(move.id)];
    return island ? [{ island, offset: { x: move.at.x - island.box.x, y: move.at.y - island.box.y } }] : [];
  });
  return safeOrder(planned, horizontal);
};

export { distributePlan };
