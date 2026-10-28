/* @layer renderer-app @kind hook */
import { announce } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { ANNOUNCE_TEXT } from '../announce/announce.constants';
import { CATALOGUE_TEXT } from '../editor/tool-catalogue/tool-catalogue.constants';
import { slotOfTool } from '../editor/tool-catalogue/slot-of-tool';
import { activeMember } from '../editor/tool-pick/active-member';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useToolNoticeStore } from '../stores/useToolNoticeStore';
import { useToolStore } from '../stores/useToolStore';
import { currentSurface } from '../surface/current-surface';

const useAnnounceTool = (): void => {
  const tool = useToolStore((state) => state.tool);
  const shape = useToolStore((state) => state.shape);
  const variant = useSelectionStore((state) => state.variant);
  const seen = useRef({ tool, shape, variant });
  useEffect(() => {
    const before = seen.current;
    seen.current = { tool, shape, variant };
    if (before.tool === tool && before.shape === shape && before.variant === variant) return;
    const member = activeMember();
    if (!member) return;
    announce(ANNOUNCE_TEXT.tool(member.label));
    const slot = slotOfTool(currentSurface(), tool);
    if (before.tool === tool && slot && slot.members.length > 1) useToolNoticeStore.getState().show(CATALOGUE_TEXT.cycleHint(member.label, slot.key));
  }, [tool, shape, variant]);
};

export { useAnnounceTool };
