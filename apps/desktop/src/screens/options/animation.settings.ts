/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ANIMATION_SECTIONS } from '../../timeline/animation-sections.constants';

const meta: ScreenMeta = {
  title: 'Animation',
  icon: 'image',
  order: 2.6,
  keywords: ['animation', 'timeline', 'onion skin', 'ghost', 'playback', 'speed', 'rewind', 'thumbnail', 'frames', 'ticks', 'units'],
};

const sections: Section[] = ANIMATION_SECTIONS;

export default sections;
export { meta };
