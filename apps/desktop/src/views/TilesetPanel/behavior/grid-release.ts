/* @layer renderer-app @kind logic */
import { pickTile } from '../../../tilemap/pick-tile';
import { setLayout } from '../../../tilemap/set-layout';
import type { GridReleaseInput } from './grid-press.type';

const gridRelease = ({ paint, pressed, held, moving, hover, dragged, keyOf }: GridReleaseInput): void => {
  pressed.current = false;
  if (paint.active) paint.commit();
  const kept = held.current;
  held.current = null;
  const keptKey = kept === null ? null : keyOf(kept);
  if (kept !== null && !dragged.current && keptKey !== null) pickTile(keptKey);
  const from = moving.current;
  moving.current = null;
  if (from !== null && hover.current !== null) setLayout({ move: [{ key: from, to: hover.current }] });
};

export { gridRelease };
