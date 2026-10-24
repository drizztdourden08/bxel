/* @layer renderer-app @kind component */
import { EmptyState, Flex } from '@drizztdourden08/tessera';
import type { ConfigEmptyProps } from './ConfigEmpty.type';

const ConfigEmpty = ({ title, message, actions }: ConfigEmptyProps) => (
  <EmptyState
    size="md"
    title={title}
    message={message}
    action={
      actions === undefined ? undefined : (
        <Flex gap="xs" wrap>
          {actions}
        </Flex>
      )
    }
  />
);

export { ConfigEmpty };
