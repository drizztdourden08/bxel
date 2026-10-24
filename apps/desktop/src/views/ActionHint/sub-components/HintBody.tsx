/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import type { HintBodyProps } from '../ActionHint.type';
import { HintShortcutRow } from './HintShortcutRow';

const HintBody = ({ hint }: HintBodyProps) => (
  <Stack gap="xs">
    <Text as="span" variant="label">{hint.name}</Text>
    <Text as="span" variant="caption" tone="muted">{hint.description}</Text>
    {hint.shortcuts?.map((shortcut, index) => <HintShortcutRow key={index} shortcut={shortcut} />)}
  </Stack>
);

export { HintBody };
