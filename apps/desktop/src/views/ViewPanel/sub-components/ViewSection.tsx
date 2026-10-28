/* @layer renderer-app @kind component */
import { Disclosure, Flex, Icon, Text } from '@drizztdourden08/tessera';
import type { ViewSectionProps } from '../ViewPanel.type';

const ViewSection = ({ title, icon, children }: ViewSectionProps) => (
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
);

export { ViewSection };
