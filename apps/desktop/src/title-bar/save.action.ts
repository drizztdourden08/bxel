/* @layer renderer-app @kind config */
import { defineTitleBarItem } from '@drizztdourden08/brock-react';
import { useSaveItem } from '../hooks/useSaveItem';

const order = 3;

export default defineTitleBarItem(useSaveItem);
export { order };
