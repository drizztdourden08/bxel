/* @layer renderer-app @kind logic */
import { placePaste } from './place-paste';

const pasteClip = (): boolean => placePaste(false);

export { pasteClip };
