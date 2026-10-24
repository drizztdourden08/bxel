/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, Icon, IconButton, ListItemList, ListItemRow, Stack, Text } from '@drizztdourden08/tessera';
import { PROJECT_TEXT } from '../../../project/project.constants';
import type { OpenProject } from '../../../project/project.type';
import { useProjectSettings } from '../behavior/useProjectSettings';

const ProjectSettingsForm = ({ project }: { readonly project: OpenProject }) => {
  const model = useProjectSettings(project);
  return (
    <DialogShell
      open
      title={`${PROJECT_TEXT.settingsTitle}: ${project.manifest.name}`}
      onClose={model.hide}
      actions={
        <Button variant="primary" onClick={model.hide}>
          {PROJECT_TEXT.done}
        </Button>
      }
    >
      <Stack gap="md">
        <Text variant="label">{PROJECT_TEXT.linkedTitle}</Text>
        <ListItemList label={PROJECT_TEXT.linkedTitle}>
          {project.folders.map((folder, index) => (
            <ListItemRow
              key={folder.folderId}
              icon={<Icon name="folder" />}
              name={index === 0 ? PROJECT_TEXT.rootFolder : folder.name}
              meta={folder.path}
              actionVisibility="always"
              action={
                index === 0 ? undefined : (
                  <IconButton label={PROJECT_TEXT.removeLinked(folder.name)} size="xs" disabled={model.busy} onClick={() => model.remove(folder.folderId)}>
                    <Icon name="x" />
                  </IconButton>
                )
              }
            />
          ))}
        </ListItemList>
        <Button variant="secondary" size="sm" disabled={model.busy} onClick={model.add}>
          {PROJECT_TEXT.addLinked}
        </Button>
        <Text variant="caption" tone="muted">
          {PROJECT_TEXT.linkedHint}
        </Text>
        {model.error !== null && <Callout tone="danger">{model.error}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { ProjectSettingsForm };
