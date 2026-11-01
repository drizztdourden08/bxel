/* @layer renderer-app @kind component */
import { Flex, Shortcut, Text } from '@drizztdourden08/tessera';
import type { ShortcutKey } from '@drizztdourden08/tessera';
import { CUSTOMIZE_TEXT } from '../CustomizeTools.constants';

const KeyRow = ({ label, keys }: { label: string; keys: ShortcutKey[] | undefined }) => (
  <Flex align="center" justify="between" gap="sm">
    <Text variant="body">{label}</Text>
    {keys ? (
      <Shortcut size="xs" keys={keys} />
    ) : (
      <Text variant="caption" tone="muted">
        {CUSTOMIZE_TEXT.noKey}
      </Text>
    )}
  </Flex>
);

export { KeyRow };
