/* @layer renderer-app @kind config */
import { defineTitleBarItem } from '@drizztdourden08/brock-react';
import { useAssistantItem } from '../hooks/useAssistantItem';

const order = 0;

export default defineTitleBarItem(useAssistantItem);
export { order };
