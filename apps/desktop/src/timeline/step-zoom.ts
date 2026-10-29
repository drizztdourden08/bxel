/* @layer renderer-app @kind logic */
import { THUMB_SIZES } from '../stores/timeline-store.constants';

const stepZoom = (current: number, direction: 1 | -1): number => {
  const sizes = [...THUMB_SIZES];
  const next = direction === 1 ? sizes.find((size) => size > current) : [...sizes].reverse().find((size) => size < current);
  return next ?? (direction === 1 ? (sizes.at(-1) ?? current) : (sizes[0] ?? current));
};

export { stepZoom };
