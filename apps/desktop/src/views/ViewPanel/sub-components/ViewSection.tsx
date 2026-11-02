/* @layer renderer-app @kind component */
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box, Disclosure, Flex, Icon, Text } from '@drizztdourden08/tessera';
import { SECTION_MENU } from '../../../view-section/view-section.constants';
import type { ViewSectionProps } from '../ViewPanel.type';

const ViewSection = ({ section, title, icon, children }: ViewSectionProps) => (
  <Box {...contextMenuZone(SECTION_MENU.zone, { data: { section } })}>
    <Disclosure
      defaultOpen
      size="sm"
      className="view-panel__section"
      bodyClassName="view-panel__body"
      summary={
        <Flex as="span" gap="xs" align="center">
          <Icon name={icon} size={14} />
          <Text as="span" variant="label">{title}</Text>
        </Flex>
      }
    >
      {children}
    </Disclosure>
  </Box>
);

export { ViewSection };
