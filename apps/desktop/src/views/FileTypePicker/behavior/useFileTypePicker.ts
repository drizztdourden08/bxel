/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { CreatableKind } from '../../../stores/creation-store.type';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { useFileTypePanelStore } from '../../../stores/useFileTypePanelStore';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';

const useFileTypePicker = (): { readonly choose: (kind: CreatableKind) => void } => {
  const activeTab = useWorkspaceStore((state) => state.activeTab);
  const opened = useRef(activeTab);
  useEffect(() => {
    if (opened.current !== activeTab) useFileTypePanelStore.getState().hide();
  }, [activeTab]);
  return { choose: (kind) => useCreateDialogStore.getState().show('file', kind) };
};

export { useFileTypePicker };
