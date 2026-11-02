/* @layer renderer-app @kind component */
import { Box, Button, EmptyState, Icon, ScrollArea, Text } from '@drizztdourden08/tessera';
import { healthSummary } from '../../project-health/health-summary';
import { HEALTH_TEXT } from '../../project-health/project-health.constants';
import { useHealthWatch } from '../../project-health/useHealthWatch';
import { useProjectStore } from '../../stores/useProjectStore';
import { useHealthActions } from './behavior/useHealthActions';
import { HealthBody } from './sub-components/HealthBody';
import './ProjectHealth.css';

const ProjectHealth = () => {
  const project = useProjectStore((state) => state.project);
  const state = useHealthWatch(project);
  const actions = useHealthActions();
  if (project === null) return <EmptyState size="sm" title={HEALTH_TEXT.noProjectTitle} message={HEALTH_TEXT.noProjectMessage} />;
  const report = state.status === 'ready' ? state.report : null;
  return (
    <ScrollArea axis="y" scrollbar="slim" thumb="auto" fade={false} className="project-health">
      <Box className="project-health__head">
        <Icon name="heart" size={20} />
        <Box className="project-health__title">
          <Text as="h2" variant="title">
            {HEALTH_TEXT.title}
          </Text>
          <Text as="p" variant="caption" tone="muted" role="status">
            {healthSummary(report)}
          </Text>
        </Box>
        <Button size="sm" variant="secondary" onClick={actions.recheck} disabled={state.status === 'scanning'}>
          {HEALTH_TEXT.recheck}
        </Button>
      </Box>
      {report !== null && <HealthBody report={report} actions={actions} />}
    </ScrollArea>
  );
};

export { ProjectHealth };
