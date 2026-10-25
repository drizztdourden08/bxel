/* @layer renderer-app @kind component */
import { Callout, ListItemList, SettingsSection, Stack, Text } from '@drizztdourden08/tessera';
import { GRANTS_TEXT } from './AssistantProjects.constants';
import { useAssistantProjects } from './behavior/useAssistantProjects';
import { GrantRowCard } from './sub-components/GrantRowCard';

const AssistantProjects = () => {
  const model = useAssistantProjects();
  return (
    <SettingsSection id="projects" title={GRANTS_TEXT.title} description={GRANTS_TEXT.intro}>
      <Stack gap="md">
        <Callout tone="info">{GRANTS_TEXT.needsOpen}</Callout>
        {model.rows.length === 0 ? (
          <Text tone="muted">{GRANTS_TEXT.empty}</Text>
        ) : (
          <ListItemList label={GRANTS_TEXT.title}>
            {model.rows.map((row) => (
              <GrantRowCard key={`${row.projectId}:${row.rootRealPath}`} row={row} onChange={(value) => model.setAccess(row, value)} />
            ))}
          </ListItemList>
        )}
        <Text variant="caption" tone="muted">
          {GRANTS_TEXT.needsAccess}
        </Text>
      </Stack>
    </SettingsSection>
  );
};

export { AssistantProjects };
