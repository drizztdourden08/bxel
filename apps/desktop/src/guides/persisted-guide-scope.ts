/* @layer renderer-app @kind logic */
import { GUIDE_LABEL } from './guide.constants';
import type { GuideAxis, GuideLines, GuideScope, PersistedGuides } from './guide.type';
import { sortedLine } from './sorted-line';

const NONE: GuideLines = { x: [], y: [] };

const persistedGuideScope = ({ lines, size, step, write }: PersistedGuides): GuideScope => {
  const now = lines ?? NONE;
  const change = (label: string, axis: GuideAxis, next: readonly number[]): void => write(label, { ...now, [axis]: sortedLine(next) });
  return {
    lines: () => lines,
    size,
    step,
    add: (axis, position) => change(GUIDE_LABEL.add, axis, [...now[axis], position]),
    move: (axis, from, to) => change(GUIDE_LABEL.move, axis, now[axis].map((at) => (at === from ? to : at))),
    remove: (axis, position) => change(GUIDE_LABEL.remove, axis, now[axis].filter((at) => at !== position)),
    clear: () => write(GUIDE_LABEL.clear, NONE),
  };
};

export { persistedGuideScope };
