/* @layer renderer-app @kind hook */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { useEditorMenu } from './useEditorMenu';
import { useFileMenu } from './useFileMenu';

const useAppMenu = (): MenuEntry[] => {
  const file = useFileMenu();
  const editor = useEditorMenu();
  return useMemo(() => [...file, ...editor], [file, editor]);
};

export { useAppMenu };
