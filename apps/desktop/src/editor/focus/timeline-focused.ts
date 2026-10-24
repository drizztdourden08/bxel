/* @layer renderer-app @kind logic */
import { FOCUS_ZONE, FOCUS_ZONE_ATTRIBUTE } from './focus-zone.constants';

const timelineFocused = (): boolean => {
  const active = typeof document === 'undefined' ? null : document.activeElement;
  return (active?.closest(`[${FOCUS_ZONE_ATTRIBUTE}="${FOCUS_ZONE.timeline}"]`) ?? null) !== null;
};

export { timelineFocused };
