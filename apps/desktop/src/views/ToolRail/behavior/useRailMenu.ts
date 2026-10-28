/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';
import { railEntries } from './rail-entries';

const useRailMenu = (): void => {
  useContextMenu(TOOL_RAIL_TEXT.zone, { entries: railEntries, label: TOOL_RAIL_TEXT.menuLabel, inherit: 'parent' });
};

export { useRailMenu };
