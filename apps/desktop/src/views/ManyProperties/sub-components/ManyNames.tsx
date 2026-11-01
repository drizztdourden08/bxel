/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import type { ManyItem } from '../../../properties-subject/many-subject.type';
import { MANY_TEXT } from '../ManyProperties.constants';

const ManyNames = ({ items }: { readonly items: readonly ManyItem[] }) => (
  <Stack gap="xs">
    <Text as="h3" variant="overline" tone="muted">
      {MANY_TEXT.files}
    </Text>
    {items.map((item) => (
      <Text key={item.id} as="span" variant="caption" tone="muted">
        {item.name}
      </Text>
    ))}
  </Stack>
);

export { ManyNames };
