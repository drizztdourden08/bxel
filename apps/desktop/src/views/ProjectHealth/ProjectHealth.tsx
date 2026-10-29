/* @layer renderer-app @kind component */
import { Box, Button, EmptyState, Icon, Text } from '@drizztdourden08/tessera';
import { HEALTH_TEXT } from '../../project-health/project-health.constants';
import { useHealthWatch } from '../../project-health/useHealthWatch';
import { useProjectStore } from '../../stores/useProjectStore';
import { useHealthActions } from './behavior/useHealthActions';
import { FileSections } from './sub-components/FileSections';
import { LinkSection } from './sub-components/LinkSection';
import { StateSections } from './sub-components/StateSections';
import './ProjectHealth.css';

const ProjectHealth = () => {
  const project = useProjectStore((state) => state.project);
  const state = useHealthWatch(project);
  const actions = useHealthActions();
  if (project === null) return <EmptyState size="sm" title={HEALTH_TEXT.noProjectTitle} message={HEALTH_TEXT.noProjectMessage} />;
  const report = state.status === 'ready' ? state.report : null;
  return (
    <Box className="project-health">
      <Box className="project-health__head">
        <Icon name="heart" size={20} />
        <Box className="project-health__title">
          <Text as="h2" variant="title">
            {HEALTH_TEXT.title}
          </Text>
          <Text as="p" variant="caption" tone="muted" role="status">
            {report === null ? HEALTH_TEXT.scanning : report.total === 0 ? HEALTH_TEXT.allGood : HEALTH_TEXT.summary(report.total, report.files)}
          </Text>
        </Box>
        <Button size="sm" variant="secondary" onClick={actions.recheck} disabled={state.status === 'scanning'}>
          {HEALTH_TEXT.recheck}
        </Button>
      </Box>
      {report !== null && report.total === 0 && <EmptyState size="sm" title={HEALTH_TEXT.allGood} message={HEALTH_TEXT.allGoodMessage(report.files)} />}
      {report !== null && report.broken.length > 0 && <LinkSection findings={report.broken} actions={actions} title={HEALTH_TEXT.brokenTitle} hint={HEALTH_TEXT.brokenHint} moved={false} />}
      {report !== null && report.moved.length > 0 && <LinkSection findings={report.moved} actions={actions} title={HEALTH_TEXT.movedTitle} hint={HEALTH_TEXT.movedHint} moved />}
      {report !== null && <FileSections report={report} actions={actions} />}
      {report !== null && <StateSections report={report} actions={actions} />}
    </Box>
  );
};

export { ProjectHealth };
