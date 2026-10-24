/* @layer renderer-app @kind component */
import { FOLDER_ROLES } from '@bxel/project';
import { Button, Callout, Card, Icon, IconButton, Stack, Text } from '@drizztdourden08/tessera';
import { PROJECT_TEXT } from '../../../project/project.constants';
import { useProjectFocus } from '../../../project-config/useProjectFocus';
import { useFolders } from '../behavior/useFolders';
import { RoleField } from './RoleField';

const FoldersControl = () => {
  const focus = useProjectFocus();
  const model = useFolders();
  if (!focus) return null;
  const { manifest, folders } = focus.project;
  return (
    <Stack gap="md">
      {manifest.folders.map((stored, index) => {
        const where = folders.find((each) => each.folderId === stored.folderId);
        return (
          <Card key={stored.folderId}>
            <Stack gap="sm">
              <Stack gap="2xs">
                <Text variant="label">{index === 0 ? PROJECT_TEXT.rootFolder : stored.name}</Text>
                <Text variant="caption" tone="muted">
                  {where?.path ?? stored.path}
                </Text>
              </Stack>
              {FOLDER_ROLES.map((role) => (
                <RoleField key={role} role={role} value={stored.roles[role] ?? ''} onCommit={(path) => model.setRole(stored.folderId, role, path)} />
              ))}
              {index > 0 && (
                <IconButton label={PROJECT_TEXT.removeLinked(stored.name)} size="xs" disabled={model.busy} onClick={() => model.remove(stored.folderId)}>
                  <Icon name="x" />
                </IconButton>
              )}
            </Stack>
          </Card>
        );
      })}
      <Button variant="secondary" size="sm" disabled={model.busy} onClick={model.add}>
        {PROJECT_TEXT.addLinked}
      </Button>
      <Text variant="caption" tone="muted">
        {PROJECT_TEXT.linkedHint}
      </Text>
      {model.error !== null && <Callout tone="danger">{model.error}</Callout>}
    </Stack>
  );
};

export { FoldersControl };
