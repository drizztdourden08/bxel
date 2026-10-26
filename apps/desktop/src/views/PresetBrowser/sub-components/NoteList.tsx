/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';

const NoteList = ({ title, lines }: { title: string; lines: readonly string[] }) =>
  lines.length === 0 ? null : (
    <Stack gap="xs">
      <Text variant="label">{title}</Text>
      {lines.map((line) => (
        <Text key={line} variant="caption" tone="muted">
          {line}
        </Text>
      ))}
    </Stack>
  );

export { NoteList };
