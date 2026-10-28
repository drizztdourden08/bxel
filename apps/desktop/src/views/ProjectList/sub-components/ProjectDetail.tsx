/* @layer renderer-app @kind component */
import { nav } from '@drizztdourden08/brock-react';
import { Box, Button, Callout, EmptyState, Flex, Spinner, Stack, Text } from '@drizztdourden08/tessera';
import { PROJECT_HUB } from '../../../config-entry/config-entry.constants';
import { ProjectBrowser } from '../../ProjectBrowser';
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

const DetailBody = ({ model, project }: ProjectPartProps) => {
  if (project.open) return <Callout tone="info">{PROJECTS_TEXT.isOpen}</Callout>;
  if (model.disk.status === 'loading') return <Spinner label={PROJECTS_TEXT.loading} />;
  if (model.disk.status === 'failed') return <EmptyState size="sm" title={PROJECTS_TEXT.failedTitle} message={model.disk.message} />;
  if (model.disk.status === 'ready') return <Box className="project-list__browse"><ProjectBrowser project={null} disk={model.disk.project} /></Box>;
  return <Text tone="muted">{PROJECTS_TEXT.loading}</Text>;
};

/** One known project: who it is, what can be done with it, and, when it is closed, a read only look inside. */
const ProjectDetail = ({ model, project }: ProjectPartProps) => (
  <Stack gap="md" className="project-list__detail">
    <DetailHead key={project.key} model={model} project={project} />
    <DetailBody model={model} project={project} />
  </Stack>
);

export { ProjectDetail };
