/* @layer renderer-app @kind component */
import { Callout, EmptyState, Stack, Text } from '@drizztdourden08/tessera';
import { GRANTS_TEXT } from './AssistantProjects.constants';
import { useAssistantProjects } from './behavior/useAssistantProjects';
import { GrantRowCard } from './sub-components/GrantRowCard';

const AssistantProjects = () => {
  const model = useAssistantProjects();
  return (
    <Stack gap="md">
      <Text>{GRANTS_TEXT.intro}</Text>
      <Callout tone="info">{GRANTS_TEXT.needsOpen}</Callout>
      {model.rows.length === 0 && <EmptyState message={GRANTS_TEXT.empty} />}
      {model.rows.map((row) => (
        <GrantRowCard key={`${row.projectId}:${row.rootRealPath}`} row={row} onChange={(value) => model.setAccess(row, value)} />
      ))}
      <Text variant="caption" tone="muted">
        {GRANTS_TEXT.needsAccess}
      </Text>
    </Stack>
  );
};

export { AssistantProjects };
