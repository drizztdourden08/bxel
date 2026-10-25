/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useToolbarLayoutStore } from '@drizztdourden08/brock-react';
import type { ToolbarDef } from '@drizztdourden08/brock-react';

const useToolbarDefinitions = (toolbars: readonly ToolbarDef[]): void => {
  useEffect(() => useToolbarLayoutStore.getState().setDefinitions(toolbars), [toolbars]);
};

export { useToolbarDefinitions };
