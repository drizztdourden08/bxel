/* @layer renderer-app @kind component */
import { nav } from '@drizztdourden08/brock-react';
import { Button, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { PROJECT_HUB } from '../../../config-entry/config-entry.constants';
import { PROJECTS_TEXT } from '../ProjectList.constants';
import type { ProjectPartProps } from '../ProjectList.type';

const DetailHead = ({ model, project }: ProjectPartProps) => (
  <Flex justify="between" align="center" gap="sm" wrap>
    <Stack gap="xs">
      <Text variant="title">{project.name}</Text>
      <Text variant="caption" tone="muted">
        {project.rootRealPath}
      </Text>
    </Stack>
    <Flex gap="xs" wrap>
      {project.open ? (
        <>
          <Button size="sm" variant="primary" onClick={() => nav.open(`${PROJECT_HUB}/browse`)}>
            {PROJECTS_TEXT.toBrowse}
          </Button>
          <Button size="sm" variant="secondary" onClick={model.actions.closeProject}>
            {PROJECTS_TEXT.closeIt}
          </Button>
        </>
      ) : (
        <Button size="sm" variant="primary" onClick={() => model.actions.openProject(project)}>
          {PROJECTS_TEXT.openIt}
        </Button>
      )}
      <Button size="sm" variant="tertiary" onClick={() => model.actions.reveal(project)}>
        {PROJECTS_TEXT.reveal}
      </Button>
    </Flex>
  </Flex>
);

export { DetailHead };
