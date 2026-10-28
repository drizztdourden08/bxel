/* @layer renderer-app @kind component */
import { Button, Flex, ListItemList, Stack, Text } from '@drizztdourden08/tessera';
import { PROJECTS_TEXT } from '../ProjectList.constants';
import type { ProjectListPartProps } from '../ProjectList.type';
import { ProjectCard } from './ProjectCard';

const ProjectsColumn = ({ model }: ProjectListPartProps) => (
  <Stack gap="sm">
    <Flex gap="xs" wrap>
      <Button size="sm" variant="primary" onClick={model.actions.newProject}>
        {PROJECTS_TEXT.newProject}
      </Button>
      <Button size="sm" variant="secondary" onClick={model.actions.browseProject}>
        {PROJECTS_TEXT.openProject}
      </Button>
    </Flex>
    {model.known.length === 0 ? (
      <Text tone="muted">{PROJECTS_TEXT.listEmpty}</Text>
    ) : (
      <ListItemList label={PROJECTS_TEXT.listTitle}>
        {model.known.map((project) => (
          <ProjectCard key={project.key} model={model} project={project} />
        ))}
      </ListItemList>
    )}
  </Stack>
);

export { ProjectsColumn };
