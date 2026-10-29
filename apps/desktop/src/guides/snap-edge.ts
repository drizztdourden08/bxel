/* @layer renderer-app @kind logic */
import { useViewStore } from '../stores/useViewStore';
import { guideScope } from './guide-scope';
import { nearestLine } from './nearest-line';

const snapEdge = (raw: { x: number; y: number }, zoom: number): { x: number; y: number } => {
  const { snap, guides } = useViewStore.getState();
  const lines = snap && guides ? guideScope()?.lines() : undefined;
  return {
    x: (lines ? nearestLine(raw.x, lines.x, zoom) : null) ?? Math.round(raw.x),
    y: (lines ? nearestLine(raw.y, lines.y, zoom) : null) ?? Math.round(raw.y),
  };
};

export { snapEdge };
