/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveAsset } from '../hooks/useActiveAsset';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { resolveSubject } from './resolve-subject';
import type { SubjectState } from './properties-subject.type';
import { useSubjectStore } from './useSubjectStore';

const useSubject = (): SubjectState => {
  const pin = useSubjectStore((state) => state.pin);
  const follow = useActiveAsset()?.tab ?? null;
  const views = useDocumentStore((state) => state.views);
  const tabs = useWorkspaceStore((state) => state.tabs);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  return useMemo(() => resolveSubject({ pin, follow, tabs, workspaces, views }), [pin, follow, tabs, workspaces, views]);
};

export { useSubject };
