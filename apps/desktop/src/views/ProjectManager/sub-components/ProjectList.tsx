/* @layer renderer-app @kind component */
import { Button, Flex, ListItemList, Stack, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import type { ManagerPartProps } from '../ProjectManager.type';
import { ProjectListRow } from './ProjectListRow';

const ProjectList = ({ model }: ManagerPartProps) => (
  <Stack gap="sm">
    <Flex gap="xs" wrap>
      <Button size="sm" variant="primary" onClick={model.actions.newProject}>
        {MANAGER_TEXT.newProject}
      </Button>
      <Button size="sm" variant="secondary" onClick={model.actions.browseProject}>
        {MANAGER_TEXT.openProject}
      </Button>
    </Flex>
    {model.known.length === 0 ? (
      <Text tone="muted">{MANAGER_TEXT.listEmpty}</Text>
    ) : (
      <ListItemList label={MANAGER_TEXT.listTitle}>
        {model.known.map((project) => (
          <ProjectListRow key={project.key} model={model} project={project} />
        ))}
      </ListItemList>
    )}
  </Stack>
);

export { ProjectList };
