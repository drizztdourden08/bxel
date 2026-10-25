/* @layer renderer-app @kind component */
import { Stack, Strong, Text } from '@drizztdourden08/tessera';
import type { RowHeadingProps } from '../ConfigRow.type';

const RowHeading = ({ text }: RowHeadingProps) => (
  <Stack gap="2xs" className="config-row__text">
    <Text>
      <Strong>{text.label}</Strong>
    </Text>
    {text.description !== undefined && <Text variant="subtitle">{text.description}</Text>}
    {text.hint !== undefined && (
      <Text variant="subtitle" tone="muted">
        {text.hint}
      </Text>
    )}
  </Stack>
);

export { RowHeading };
