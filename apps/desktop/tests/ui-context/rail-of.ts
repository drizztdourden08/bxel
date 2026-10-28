/* @layer renderer-app @kind test */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { shownMember } from '../../src/editor/tool-catalogue/shown-member';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { surfaceOfContext } from '../../src/editor/tool-catalogue/surface-of-context';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { evaluate } from '../../src/ui-context/evaluate';
import { railItems } from '../../src/views/ToolRail/behavior/rail-items';
import { columnContext } from './columns';
import type { Column } from './columns';

const railOf = (column: Column): ToolbarItem[] => {
  const context = columnContext(column);
  const surface = surfaceOfContext(context);
  return railItems(slotsOf(surface), (slot) => ({
    surface,
    active: 'pencil',
    shown: shownMember(slot, { shape: 'line', variant: 'rect' }),
    filled: false,
    badge: null,
    keys: undefined,
    ui: evaluate(COMMAND_ID.tool(slot.tool), context),
    groups: undefined,
    hasFlyout: false,
    pick: () => undefined,
  }));
};

export { railOf };
