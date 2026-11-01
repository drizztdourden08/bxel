/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import type { ManyItem } from '../../../properties-subject/many-subject.type';
import { MANY_TEXT } from '../ManyProperties.constants';

const countKinds = (items: readonly ManyItem[]): readonly (readonly [string, number])[] => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.kind, (counts.get(item.kind) ?? 0) + 1);
  return [...counts];
};

const ManyKinds = ({ items }: { readonly items: readonly ManyItem[] }) => (
  <Stack gap="xs">
    <Text as="h3" variant="overline" tone="muted">
      {MANY_TEXT.kinds}
    </Text>
    {countKinds(items).map(([kind, count]) => (
      <Text key={kind}>{MANY_TEXT.kindCount(kind, count)}</Text>
    ))}
  </Stack>
);

export { ManyKinds };
