/* @layer renderer-app @kind logic */
import { MAC_PLATFORM } from '../ActionHint.constants';

const isMac = (): boolean => typeof navigator !== 'undefined' && MAC_PLATFORM.test(navigator.userAgent);

export { isMac };
