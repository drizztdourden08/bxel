/* @layer renderer-app @kind component */
import { Flex, InlineCreateForm, Stack, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import { useProjectRename } from '../behavior/useProjectRename';
import type { ProjectRowProps } from '../ProjectManager.type';
import { ProjectActions } from './ProjectActions';

const ProjectHeader = ({ model, project }: ProjectRowProps) => {
  const rename = useProjectRename(model.actions.renameProject);
  return (
    <Stack gap="sm">
      <Flex justify="between" align="center" gap="sm" wrap>
        <Stack gap="xs">
          <Text variant="title">{project.name}</Text>
          <Text variant="caption" tone="muted">
            {project.rootRealPath}
          </Text>
        </Stack>
        <ProjectActions model={model} project={project} rename={rename} />
      </Flex>
      {rename.renaming && (
        <InlineCreateForm
          compact
          label={MANAGER_TEXT.renameLabel}
          defaultValue={project.name}
          submitLabel={MANAGER_TEXT.renameSubmit}
          cancelLabel={MANAGER_TEXT.cancel}
          error={rename.error ?? undefined}
          onCreate={rename.submit}
          onCancel={rename.stop}
        />
      )}
    </Stack>
  );
};

export { ProjectHeader };
