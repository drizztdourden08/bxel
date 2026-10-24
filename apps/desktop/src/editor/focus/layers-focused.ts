/* @layer renderer-app @kind logic */
import { FOCUS_ZONE, FOCUS_ZONE_ATTRIBUTE } from './focus-zone.constants';

const layersFocused = (): boolean => {
  const active = document.activeElement;
  return (active?.closest(`[${FOCUS_ZONE_ATTRIBUTE}="${FOCUS_ZONE.layers}"]`) ?? null) !== null;
};

export { layersFocused };
