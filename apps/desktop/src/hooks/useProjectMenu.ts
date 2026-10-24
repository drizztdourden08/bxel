/* @layer renderer-app @kind hook */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { projectMenu } from '../menu/project-menu';
import { openProject } from '../project/open-project';
import { useProjectStore } from '../stores/useProjectStore';

const useProjectMenu = (): MenuEntry[] => {
  const recent = useProjectStore((state) => state.recents);
  const isOpen = useProjectStore((state) => state.project !== null);
  return useMemo(() => [projectMenu(recent, isOpen, (root) => void openProject(root))], [recent, isOpen]);
};

export { useProjectMenu };
