/* @layer renderer-app @kind component */
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box, Flex, Icon, Pressable, Shortcut, Tag, Text } from '@drizztdourden08/tessera';
import { pickMember } from '../../../editor/tool-pick/pick-member';
import { TOOLS_PANEL_TEXT } from '../ToolsPanel.constants';
import type { ToolRowProps } from '../ToolsPanel.type';

const ToolRow = ({ slot, member, active, hidden, disabled, keys, nested }: ToolRowProps) => (
  <Pressable
    className="tools-row"
    data-active={active}
    data-hidden={hidden}
    data-nested={nested}
    disabled={disabled}
    aria-pressed={active}
    onClick={() => pickMember(member)}
    {...contextMenuZone(TOOLS_PANEL_TEXT.zone, { data: slot.id })}
  >
    <Box as="span" className="tools-row__icon">
      <Icon name={member.icon} />
    </Box>
    <Box as="span" className="tools-row__text">
      <Flex as="span" align="center" justify="between" gap="sm">
        <Text as="span" variant="label" className="tools-row__name">
          {member.label}
        </Text>
        <Flex as="span" align="center" gap="xs">
          {hidden && <Tag>{TOOLS_PANEL_TEXT.hidden}</Tag>}
          {keys && !nested && <Shortcut size="xs" keys={keys} />}
        </Flex>
      </Flex>
      <Text as="span" variant="caption" tone="muted">
        {member.description}
      </Text>
    </Box>
  </Pressable>
);

export { ToolRow };
