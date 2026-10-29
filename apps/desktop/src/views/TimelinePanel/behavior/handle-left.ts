/* @layer renderer-app @kind logic */
import type { TrackLayout } from '../../../timeline/track-layout.type';
import type { Side } from '../sub-components/OnionHandles.type';

const handleLeft = (side: Side, layout: TrackLayout, index: number): number =>
  side === 'before' ? (layout.lefts[index] ?? 0) : (layout.lefts[index] ?? 0) + (layout.widths[index] ?? 0);

export { handleLeft };
