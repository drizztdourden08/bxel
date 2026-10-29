/* @layer renderer-app @kind logic */
import type { CSSProperties } from 'react';
import type { TrackLayout } from '../../../timeline/track-layout.type';

const spanStyle = (layout: TrackLayout, start: number, end: number): CSSProperties => ({
  insetInlineStart: layout.lefts[start],
  inlineSize: (layout.lefts[end] ?? 0) + (layout.widths[end] ?? 0) - (layout.lefts[start] ?? 0),
});

export { spanStyle };
