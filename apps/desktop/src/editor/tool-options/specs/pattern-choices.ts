/* @layer renderer-app @kind logic */
import { savedPatterns } from '../../saved-patterns';
import type { OptionChoice } from '../tool-options.type';
import { PATTERN_TEXT } from './pattern-text.constants';

const patternChoices = (): OptionChoice[] => [
  { value: '', label: PATTERN_TEXT.none, description: PATTERN_TEXT.savedDescription, icon: 'pixel-brush-square' },
  ...savedPatterns().map((pattern) => ({
    value: pattern.id,
    label: `${pattern.name} (${pattern.width} by ${pattern.height})`,
    description: PATTERN_TEXT.choiceDescription,
    icon: 'pixel-brush-custom' as const,
  })),
];

export { patternChoices };
