/* @layer renderer-app @kind hook */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { useEditorMenu } from './useEditorMenu';
import { useFileMenu } from './useFileMenu';
import { useProjectMenu } from './useProjectMenu';

const useAppMenu = (): MenuEntry[] => {
  const file = useFileMenu();
  const project = useProjectMenu();
  const editor = useEditorMenu();
  return useMemo(() => [...file, ...project, ...editor], [file, project, editor]);
};

export { useAppMenu };
