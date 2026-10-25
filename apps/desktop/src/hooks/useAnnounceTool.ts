/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { announce } from '../announce/announce';
import { ANNOUNCE_TEXT } from '../announce/announce.constants';
import { TOOLS } from '../editor/tools.constants';
import { useToolStore } from '../stores/useToolStore';

const useAnnounceTool = (): void => {
  const tool = useToolStore((state) => state.tool);
  const seen = useRef(tool);
  useEffect(() => {
    if (seen.current === tool) return;
    seen.current = tool;
    const label = TOOLS.find((each) => each.id === tool)?.label;
    if (label) announce(ANNOUNCE_TEXT.tool(label));
  }, [tool]);
};

export { useAnnounceTool };
