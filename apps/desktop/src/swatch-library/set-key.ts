/* @layer renderer-app @kind logic */
import { KEY_SEPARATOR } from './swatch-library.constants';
import type { SetOrigin } from './swatch-library.type';

const setKey = (origin: SetOrigin, id: string): string => `${origin}${KEY_SEPARATOR}${id}`;

export { setKey };
