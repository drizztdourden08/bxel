/* @layer core @kind logic */
import type { AnimatedConversion } from './animated-split.type';

const animatedNotice = (conversions: readonly AnimatedConversion[]): string | null => {
  const count = conversions.length;
  if (count === 0) return null;
  const sprites = count === 1 ? '1 sprite had frames.' : `${count} sprites had frames.`;
  const became = count === 1 ? 'It became 1 animation.' : `They became ${count} animations.`;
  return `${sprites} ${became} Save to write ${count === 1 ? 'it' : 'them'}.`;
};

export { animatedNotice };
