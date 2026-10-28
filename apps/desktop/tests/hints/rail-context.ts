/* @layer renderer-app @kind test */
import { shownMember } from '../../src/editor/tool-catalogue/shown-member';
import type { ToolSlot } from '../../src/editor/tool-catalogue/tool-catalogue.type';
import type { Surface } from '../../src/surface/surface.type';
import type { SlotItemContext } from '../../src/views/ToolRail/ToolRail.type';

const railContext =
  (surface: Surface, disabled = false) =>
  (slot: ToolSlot): SlotItemContext => ({
    surface,
    active: 'pencil',
    shown: shownMember(slot, { shape: 'line', variant: 'rect' }),
    filled: false,
    badge: null,
    keys: undefined,
    disabled,
    groups: undefined,
    hasFlyout: false,
    pick: () => undefined,
  });

export { railContext };
