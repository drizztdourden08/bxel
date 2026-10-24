/* @layer renderer-app @kind logic */
import { IMAGE_EXTENSION, UNSAFE_NAME_CHARS } from './export.constants';

const safeName = (name: string): string =>
  name
    .trim()
    .replace(IMAGE_EXTENSION, '')
    .replace(UNSAFE_NAME_CHARS, '_')
    .replace(/[. ]+$/u, '');

export { safeName };
