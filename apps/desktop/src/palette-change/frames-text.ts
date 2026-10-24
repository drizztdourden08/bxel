/* @layer renderer-app @kind logic */
import { FRAME_JOIN, FRAME_RANGE } from './palette-change.constants';

const framesText = (frames: readonly number[]): string => {
  const groups: number[][] = [];
  for (const frame of frames) {
    const last = groups.at(-1);
    if (last && frame === (last.at(-1) ?? 0) + 1) last.push(frame);
    else groups.push([frame]);
  }
  return groups.map((group) => (group.length === 1 ? String(group[0]) : `${group[0]}${FRAME_RANGE}${group.at(-1)}`)).join(FRAME_JOIN);
};

export { framesText };
