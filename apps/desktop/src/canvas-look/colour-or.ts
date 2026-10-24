/* @layer renderer-app @kind logic */
import { COLOUR_PATTERN } from './canvas-look.constants';

const colourOr = (value: unknown, fallback: string): string => (typeof value === 'string' && COLOUR_PATTERN.test(value) ? value : fallback);

export { colourOr };
