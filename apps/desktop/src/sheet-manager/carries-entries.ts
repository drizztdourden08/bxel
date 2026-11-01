/* @layer renderer-app @kind logic */
import { ASSETS_DRAG_TYPE } from './drag-payload.constants';

const carriesEntries = (transfer: DataTransfer | null): boolean => transfer?.types.includes(ASSETS_DRAG_TYPE) === true;

export { carriesEntries };
