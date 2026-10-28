/* @layer renderer-app @kind logic */
import { IMAGE_TAB_PREFIX } from './image-tab-id.constants';

const imageTabId = (path: string): string => `${IMAGE_TAB_PREFIX}${path.replaceAll('\\', '/').toLowerCase()}`;

export { imageTabId };
