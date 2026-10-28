/* @layer renderer-app @kind component */
import { Shortcut, Text } from '@drizztdourden08/tessera';
import { Fragment } from 'react';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { TOOLS_PANEL_TEXT } from '../ToolsPanel.constants';
import type { SlotBlockProps } from '../ToolsPanel.type';
import { ActiveOptions } from './ActiveOptions';
import { ToolRow } from './ToolRow';

const SlotBlock = ({ slot, shown, active, disabled, surface, keys }: SlotBlockProps) => {
  const hiddenMembers = useToolPrefsStore((state) => state.hiddenMembers);
  return (
    <div className="tools-panel__group" role="group" aria-label={slot.label}>
      <div className="tools-slot__head">
        <Text variant="label">{slot.label}</Text>
        <span>
          <Text as="span" variant="caption" tone="muted">
            {TOOLS_PANEL_TEXT.cycles(slot.key)}
          </Text>{' '}
          {keys && <Shortcut size="xs" keys={keys} />}
        </span>
      </div>
      {slot.members.map((member) => {
        const isActive = active && member.id === shown.id;
        return (
          <Fragment key={member.id}>
            <ToolRow slot={slot} member={member} active={isActive} hidden={hiddenMembers.includes(member.id)} disabled={disabled} keys={keys} nested />
            {isActive && <ActiveOptions surface={surface} tool={slot.tool} />}
          </Fragment>
        );
      })}
    </div>
  );
};

export { SlotBlock };
