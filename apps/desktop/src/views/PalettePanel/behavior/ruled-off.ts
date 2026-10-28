/* @layer renderer-app @kind logic */
import { uiState } from '../../../ui-context/ui-state';

const ruledOff = (id: string): boolean => uiState(id).state !== 'shown';

export { ruledOff };
