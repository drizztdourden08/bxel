/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { Fragment } from 'react';
import { shownMember } from '../../../editor/tool-catalogue/shown-member';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import type { ToolGroupProps } from '../ToolsPanel.type';
import { ActiveOptions } from './ActiveOptions';
import { SlotBlock } from './SlotBlock';
import { ToolRow } from './ToolRow';

const ToolGroup = ({ group, slots, surface, active, choice, keysOf }: ToolGroupProps) => {
  const hiddenMembers = useToolPrefsStore((state) => state.hiddenMembers);
  const disabled = surface === 'none';
  return (
    <section className="tools-panel__group" aria-label={group.label}>
      <Text variant="overline" tone="muted" className="tools-panel__heading">
        {group.label}
      </Text>
      {slots.map((slot) => {
        const shown = shownMember(slot, choice);
        const on = active === slot.tool && !disabled;
        if (slot.members.length > 1) return <SlotBlock key={slot.id} slot={slot} shown={shown} active={on} disabled={disabled} surface={surface} keys={keysOf(slot.tool)} />;
        return (
          <Fragment key={slot.id}>
            <ToolRow slot={slot} member={shown} active={on} hidden={hiddenMembers.includes(shown.id)} disabled={disabled} keys={keysOf(slot.tool)} nested={false} />
            {on && <ActiveOptions surface={surface} tool={slot.tool} />}
          </Fragment>
        );
      })}
    </section>
  );
};

export { ToolGroup };
