/* @layer renderer-app @kind config */
import { defineTitleBarItem } from '@drizztdourden08/brock-react';
import { useExportItem } from '../hooks/useExportItem';

const order = 4;

export default defineTitleBarItem(useExportItem);
export { order };
