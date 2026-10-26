/* @layer renderer-app @kind hook */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { editorMenu } from '../menu/editor-menu';
import { useMenuState } from './useMenuState';

const useEditorMenu = (): MenuEntry[] => {
  const state = useMenuState();
  return useMemo(() => editorMenu(state), [state]);
};

export { useEditorMenu };
