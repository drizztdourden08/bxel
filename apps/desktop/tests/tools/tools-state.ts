/* @layer renderer-app @kind test */
import { useToolStore } from '../../src/stores/useToolStore';

const tools = () => useToolStore.getState();

export { tools };
