/* @layer renderer-app @kind logic */
import { placePaste } from './place-paste';

const pasteInPlace = (): boolean => placePaste(true);

export { pasteInPlace };
