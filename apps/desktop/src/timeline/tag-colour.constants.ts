/* @layer renderer-app @kind constants */
import type { TagColourChoice } from './timeline.type';

const TAG_COLOUR_CHOICES: readonly TagColourChoice[] = [
  { name: 'Rose', hex: '#f0718a' },
  { name: 'Orange', hex: '#f59a5b' },
  { name: 'Amber', hex: '#e8b84a' },
  { name: 'Lime', hex: '#a6cf5a' },
  { name: 'Green', hex: '#5cc98a' },
  { name: 'Teal', hex: '#4cc5b8' },
  { name: 'Cyan', hex: '#5ab8e0' },
  { name: 'Blue', hex: '#6f9cf0' },
  { name: 'Violet', hex: '#a78bf5' },
  { name: 'Pink', hex: '#e57ac8' },
];

const TAG_COLOUR_START = '#3b82f6';

export { TAG_COLOUR_CHOICES, TAG_COLOUR_START };
