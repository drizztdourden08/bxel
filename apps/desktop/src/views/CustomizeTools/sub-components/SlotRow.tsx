/* @layer renderer-app @kind component */
import { useDragSource, useDropTarget } from '@drizztdourden08/brock-react';
import { Box, Flex, Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { CUSTOMIZE_TEXT, MEMBER_DRAG, SLOT_DRAG } from '../CustomizeTools.constants';
import type { MemberDragPayload, SlotDragPayload, SlotRowProps } from '../CustomizeTools.type';
import { MemberRow } from './MemberRow';

const SlotRow = ({ slot, hidden, onToggle, onMove, onMoveMember, onStep }: SlotRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const members = useRef<HTMLDivElement>(null);
  useDragSource<SlotDragPayload>(ref, { type: SLOT_DRAG, payload: () => ({ id: slot.id }) });
  useDropTarget<SlotDragPayload>(ref, {
    accepts: SLOT_DRAG,
    canDrop: (payload) => payload.id !== slot.id,
    onDrop: (payload) => onMove({ id: payload.id, group: slot.group, before: slot.id }),
  });
  useDropTarget<MemberDragPayload>(members, {
    accepts: MEMBER_DRAG,
    canDrop: (payload) => !slot.members.some((member) => member.id === payload.member),
    onDrop: (payload) => onMoveMember({ member: payload.member, to: slot.id }),
  });
  return (
    <Box ref={ref} role="group" aria-label={slot.label}>
      <Flex direction="row" gap="xs" align="center">
        <Icon name="arrow-up-down" size={14} aria-hidden="true" />
        <Text variant="label">{slot.label}</Text>
        <IconButton label={CUSTOMIZE_TEXT.moveUp(slot.label)} size="sm" variant="tertiary" onClick={() => onStep(slot.id, -1)}>
          <Icon name="arrow-up" />
        </IconButton>
        <IconButton label={CUSTOMIZE_TEXT.moveDown(slot.label)} size="sm" variant="tertiary" onClick={() => onStep(slot.id, 1)}>
          <Icon name="arrow-down" />
        </IconButton>
      </Flex>
      <Box ref={members}>
        {slot.members.map((member) => (
          <MemberRow key={member.id} member={member} slot={slot} hidden={hidden.includes(member.id)} onToggle={onToggle} onMoveMember={onMoveMember} />
        ))}
      </Box>
    </Box>
  );
};

export { SlotRow };
