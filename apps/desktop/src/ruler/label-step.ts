/* @layer renderer-app @kind logic */
import { LABEL_BASES, LABEL_DECADES, LABEL_GAP, MIN_ZOOM } from './ruler.constants';

const labelStep = (zoom: number): number => {
  const safe = Math.max(MIN_ZOOM, zoom);
  const candidates = LABEL_DECADES.flatMap((decade) => LABEL_BASES.map((base) => base * decade));
  return candidates.find((step) => step * safe >= LABEL_GAP) ?? candidates[candidates.length - 1] ?? 1;
};

export { labelStep };
