/* @layer renderer-app @kind constants */
const PATTERN_TEXT = {
  saved: 'Saved pattern',
  savedDescription: 'Dither through a pattern saved in this file. It replaces the built in pattern. Make one from a selection with New pattern from selection.',
  savedGradientDescription: 'Dither the gradient through a pattern saved in this file. Make one from a selection with New pattern from selection.',
  none: 'Built in pattern',
  choiceDescription: 'A pattern saved in this file. Wherever it has a pixel the front colour lands, elsewhere the back colour.',
} as const;

export { PATTERN_TEXT };
