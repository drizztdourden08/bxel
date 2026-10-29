/* @layer renderer-app @kind logic */
import { placePaste } from './place-paste';

const pasteCropped = (): boolean => placePaste(true, true);

export { pasteCropped };
