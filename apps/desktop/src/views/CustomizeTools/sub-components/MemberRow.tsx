/* @layer renderer-app @kind component */
import { useDragSource } from '@drizztdourden08/brock-react';
import { Box, Flex, FormRow, Icon, IconButton, Toggle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { CUSTOMIZE_TEXT, MEMBER_DRAG } from '../CustomizeTools.constants';
import type { MemberDragPayload, MemberRowProps } from '../CustomizeTools.type';

const MemberRow = ({ member, slot, hidden, onToggle, onMoveMember }: MemberRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useDragSource<MemberDragPayload>(ref, { type: MEMBER_DRAG, payload: () => ({ member: member.id }) });
  return (
    <Box ref={ref}>
      <Flex direction="row" gap="xs" align="center">
        <FormRow label={member.label} description={member.description} descriptionOverflow="hint">
          <Toggle aria-label={CUSTOMIZE_TEXT.toggle(member.label)} checked={!hidden} onChange={() => onToggle(member.id)} />
        </FormRow>
        {slot.members.length > 1 ? (
          <IconButton label={CUSTOMIZE_TEXT.alone(member.label)} size="sm" variant="tertiary" onClick={() => onMoveMember({ member: member.id, to: null })}>
            <Icon name="split" />
          </IconButton>
        ) : null}
      </Flex>
    </Box>
  );
};

export { MemberRow };
