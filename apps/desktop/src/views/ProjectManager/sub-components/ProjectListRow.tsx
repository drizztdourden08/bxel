/* @layer renderer-app @kind component */
import { Badge, Flex, Icon, IconButton, ListItemRow, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import type { ProjectRowProps } from '../ProjectManager.type';

const ProjectListRow = ({ model, project }: ProjectRowProps) => (
  <ListItemRow
    icon={<Icon name={project.open ? 'folder-open' : 'folder'} />}
    name={
      <Flex align="center" gap="xs">
        <Text variant="label">{project.name}</Text>
        {project.open && <Badge variant="inline" color="success" value="Open" label={MANAGER_TEXT.openBadge} />}
      </Flex>
    }
    meta={project.rootRealPath}
    selected={model.selected?.key === project.key}
    actionVisibility="always"
    action={
      project.open ? undefined : (
        <IconButton label={MANAGER_TEXT.removeLabel(project.name)} size="xs" onClick={() => model.actions.removeFromList(project)}>
          <Icon name="x" />
        </IconButton>
      )
    }
    onClick={() => model.select(project.key)}
  />
);

export { ProjectListRow };
