/* @layer renderer-app @kind component */
import { Box, Callout, EmptyState, Spinner, Text } from '@drizztdourden08/tessera';
import { ProjectBrowser } from '../../ProjectBrowser';
import { PROJECTS_TEXT } from '../ProjectList.constants';
import type { ProjectPartProps } from '../ProjectList.type';

const DetailBody = ({ model, project }: ProjectPartProps) => {
  if (project.open) return <Callout tone="info">{PROJECTS_TEXT.isOpen}</Callout>;
  if (model.disk.status === 'loading') return <Spinner label={PROJECTS_TEXT.loading} />;
  if (model.disk.status === 'failed') return <EmptyState size="sm" title={PROJECTS_TEXT.failedTitle} message={model.disk.message} />;
  if (model.disk.status === 'ready') {
    return (
      <Box className="project-list__browse">
        <ProjectBrowser project={null} disk={model.disk.project} />
      </Box>
    );
  }
  return <Text tone="muted">{PROJECTS_TEXT.loading}</Text>;
};

export { DetailBody };
