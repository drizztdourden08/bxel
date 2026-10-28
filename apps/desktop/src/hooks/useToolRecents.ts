/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { activeMember } from '../editor/tool-pick/active-member';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useToolStore } from '../stores/useToolStore';

const useToolRecents = (): void => {
  useEffect(() => {
    let seen = '';
    const record = (): void => {
      const { tool, shape, activeSurface } = useToolStore.getState();
      const key = `${activeSurface}|${tool}|${shape}|${useSelectionStore.getState().variant}`;
      if (key === seen) return;
      seen = key;
      const member = activeMember();
      if (member) useToolStore.getState().recordMember(member.id);
    };
    record();
    const offTool = useToolStore.subscribe(record);
    const offSelect = useSelectionStore.subscribe(record);
    return () => {
      offTool();
      offSelect();
    };
  }, []);
};

export { useToolRecents };
