/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import type { HeaderProps } from '../ProjectManager.type';

const ProjectActions = ({ model, project, rename }: HeaderProps) =>
  project.open ? (
    <Flex gap="xs" wrap>
      <Button size="sm" variant="secondary" onClick={rename.start}>
        {MANAGER_TEXT.rename}
      </Button>
      <Button size="sm" variant="secondary" onClick={model.actions.closeProject}>
        {MANAGER_TEXT.closeIt}
      </Button>
    </Flex>
  ) : (
    <Flex gap="xs" wrap>
      <Button size="sm" variant="primary" onClick={() => model.actions.openProject(project)}>
        {MANAGER_TEXT.openIt}
      </Button>
      <Button size="sm" variant="secondary" onClick={() => model.actions.removeFromList(project)}>
        {MANAGER_TEXT.removeFromList}
      </Button>
    </Flex>
  );

export { ProjectActions };
