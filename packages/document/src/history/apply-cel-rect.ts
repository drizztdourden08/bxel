/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import { writeRect } from '../pixels/write-rect';
import { replaceSprite } from '../project/replace-sprite';
import { findSprite } from '../read/find-sprite';
import type { HistoryDirection, UndoOp } from './history.type';

const applyCelRect = (project: Project, op: Extract<UndoOp, { kind: 'cel-rect' }>, direction: HistoryDirection): Project => {
  const sprite = findSprite(project, op.spriteId);
  const cel = sprite?.cels[op.celId];
  if (!sprite || !cel) return project;
  const pixels = cel.pixels.slice();
  writeRect({
    target: pixels,
    stride: sprite.width,
    rect: op.rect,
    pixels: direction === 'undo' ? op.before : op.after,
    skipZero: false,
  });
  return replaceSprite(project, { ...sprite, cels: { ...sprite.cels, [op.celId]: { ...cel, pixels } } });
};

export { applyCelRect };
