/* @layer core @kind logic */
import { channelOf } from './channel-of';
import type { ColorBox } from './extract.type';
import { makeBox } from './make-box';

const splitBox = (box: ColorBox): readonly [ColorBox, ColorBox] => {
  const { channel } = box;
  const sorted = [...box.entries].sort(
    (a, b) => channelOf(a.rgb, channel) - channelOf(b.rgb, channel) || a.rgb - b.rgb,
  );
  let running = 0;
  let cut = sorted.length - 1;
  for (const [position, entry] of sorted.entries()) {
    running += entry.count;
    if (running * 2 >= box.population) {
      cut = position + 1;
      break;
    }
  }
  const at = Math.min(Math.max(cut, 1), sorted.length - 1);
  return [makeBox(sorted.slice(0, at)), makeBox(sorted.slice(at))];
};

export { splitBox };
