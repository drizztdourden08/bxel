/* @layer renderer-app @kind logic */
import { FOCUS_ZONE, FOCUS_ZONE_ATTRIBUTE } from './focus-zone.constants';

const spritesFocused = (): boolean => {
  const active = typeof document === 'undefined' ? null : document.activeElement;
  return (active?.closest(`[${FOCUS_ZONE_ATTRIBUTE}="${FOCUS_ZONE.sprites}"]`) ?? null) !== null;
};

export { spritesFocused };
