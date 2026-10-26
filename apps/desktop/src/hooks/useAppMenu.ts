/* @layer renderer-app @kind hook */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { helpMenu } from '../menu/help-menu';
import { useEditorMenu } from './useEditorMenu';
import { useFileMenu } from './useFileMenu';
import { useProjectMenu } from './useProjectMenu';

const useAppMenu = (): MenuEntry[] => {
  const file = useFileMenu();
  const editor = useEditorMenu();
  const project = useProjectMenu();
  return useMemo(() => [...file, ...editor, ...project, helpMenu()], [file, editor, project]);
};

export { useAppMenu };
