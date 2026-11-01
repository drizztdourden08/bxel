/* @layer renderer-app @kind component */
import { Badge, Flex, Icon, IconButton, ListItemRow, Text } from '@drizztdourden08/tessera';
import { PROJECTS_TEXT } from '../ProjectList.constants';
import type { ProjectPartProps } from '../ProjectList.type';

const ProjectCard = ({ model, project }: ProjectPartProps) => (
  <ListItemRow
    icon={<Icon name={project.open ? 'folder-open' : 'folder'} size={24} />}
    name={<Text variant="label">{project.name}</Text>}
    meta={project.rootRealPath}
    selected={model.selected?.key === project.key}
    actionVisibility="always"
    action={
      <Flex gap="xs" align="center">
        <IconButton
          label={project.pinned ? PROJECTS_TEXT.unpinLabel(project.name) : PROJECTS_TEXT.pinLabel(project.name)}
          size="xs"
          active={project.pinned}
          aria-pressed={project.pinned}
          onClick={() => model.actions.togglePin(project)}
        >
          <Icon name={project.pinned ? 'pin-off' : 'pin'} />
        </IconButton>
        {project.open ? (
          <Badge variant="inline" color="success" value="Open" label={PROJECTS_TEXT.openBadge} />
        ) : (
          <IconButton label={PROJECTS_TEXT.removeLabel(project.name)} size="xs" onClick={() => model.actions.removeFromList(project)}>
            <Icon name="x" />
          </IconButton>
        )}
      </Flex>
    }
    onClick={() => model.select(project.key)}
  />
);

export { ProjectCard };
