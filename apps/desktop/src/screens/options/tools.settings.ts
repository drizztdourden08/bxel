/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { TOOL_PREF_SECTIONS } from '../../editor/tool-options/tool-pref-sections.constants';

const meta: ScreenMeta = {
  title: 'Tools',
  icon: 'pencil',
  order: 2.5,
  keywords: ['tools', 'rail', 'menu', 'hover', 'hold', 'spring', 'brush', 'size', 'presets', 'keys'],
};

const sections: Section[] = TOOL_PREF_SECTIONS;

export default sections;
export { meta };
