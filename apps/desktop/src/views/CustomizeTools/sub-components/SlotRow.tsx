/* @layer renderer-app @kind component */
import { useDragSource, useDropTarget } from '@drizztdourden08/brock-react';
import { Box, FormRow, Icon, IconButton, Stack, Text, Toggle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { CUSTOMIZE_TEXT } from '../CustomizeTools.constants';
import type { SlotDragPayload, SlotRowProps } from '../CustomizeTools.type';
import { SLOT_DRAG } from '../slot-drag.constants';

const SlotRow = ({ slot, hidden, onToggle, onMove, onStep }: SlotRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useDragSource<SlotDragPayload>(ref, { type: SLOT_DRAG, payload: () => ({ id: slot.id }) });
  useDropTarget<SlotDragPayload>(ref, {
    accepts: SLOT_DRAG,
    canDrop: (payload) => payload.id !== slot.id,
    onDrop: (payload) => onMove({ id: payload.id, group: slot.group, before: slot.id }),
  });
  return (
    <Box ref={ref} role="group" aria-label={slot.label}>
      <Stack direction="row" gap="xs" align="center">
        <Icon name="arrow-up-down" size={14} aria-hidden="true" />
        <Text variant="label">{slot.label}</Text>
        <IconButton label={CUSTOMIZE_TEXT.moveUp(slot.label)} size="sm" variant="tertiary" onClick={() => onStep(slot.id, -1)}>
          <Icon name="arrow-up" />
        </IconButton>
        <IconButton label={CUSTOMIZE_TEXT.moveDown(slot.label)} size="sm" variant="tertiary" onClick={() => onStep(slot.id, 1)}>
          <Icon name="arrow-down" />
        </IconButton>
      </Stack>
      {slot.members.map((member) => (
        <FormRow key={member.id} label={member.label} description={member.description} descriptionOverflow="hint">
          <Toggle aria-label={CUSTOMIZE_TEXT.toggle(member.label)} checked={!hidden.includes(member.id)} onChange={() => onToggle(member.id)} />
        </FormRow>
      ))}
    </Box>
  );
};

export { SlotRow };
