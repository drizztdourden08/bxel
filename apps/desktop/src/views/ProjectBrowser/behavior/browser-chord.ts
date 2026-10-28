/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';

const keyName = (key: string): string => (key === ' ' ? 'space' : key.toLowerCase());

const browserChord = (event: KeyboardEvent): string =>
  [event.ctrlKey || event.metaKey ? 'mod' : '', event.altKey ? 'alt' : '', event.shiftKey ? 'shift' : '', keyName(event.key)].filter((part) => part !== '').join('+');

export { browserChord };
