/* @layer renderer-app @kind component */
import { Card, Field, Select, Stack, Text } from '@drizztdourden08/tessera';
import { ACCESS_OPTIONS, GRANTS_TEXT } from '../AssistantProjects.constants';
import type { GrantRowProps } from '../AssistantProjects.type';

const GrantRowCard = ({ row, onChange }: GrantRowProps) => (
  <Card>
    <Stack gap="sm">
      <Stack gap="xs">
        <Text variant="label">{row.name}</Text>
        {row.open && (
          <Text variant="caption" tone="muted">
            {GRANTS_TEXT.openBadge}
          </Text>
        )}
      </Stack>
      <Field label={GRANTS_TEXT.grantLabel(row.name)}>
        <Select options={ACCESS_OPTIONS} value={row.access} onChange={onChange} aria-label={GRANTS_TEXT.grantLabel(row.name)} />
      </Field>
      <Stack gap="xs">
        <Text variant="caption" tone="muted">
          {GRANTS_TEXT.folders}
        </Text>
        {row.folders.map((folder) => (
          <Text key={folder} variant="caption">
            {folder}
          </Text>
        ))}
      </Stack>
    </Stack>
  </Card>
);

export { GrantRowCard };
