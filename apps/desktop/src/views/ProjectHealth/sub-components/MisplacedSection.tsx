/* @layer renderer-app @kind component */
import { Box, Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';

const MisplacedSection = ({ report, actions }: ReportProps) => (
  <HealthSection
    title={HEALTH_TEXT.misplacedTitle}
    hint={HEALTH_TEXT.misplacedHint}
    count={report.misplaced.length}
    actions={
      <Button size="sm" variant="primary" onClick={() => actions.moveToRole(report.misplaced)}>
        {HEALTH_TEXT.moveAllToRole}
      </Button>
    }
  >
    {report.misplaced.map((finding) => (
      <ListItemRow
        key={finding.fix}
        icon={<Icon name={iconOfKind(finding.kind)} />}
        name={finding.name}
        meta={`${finding.path}. ${HEALTH_TEXT.expected(finding.folder)}`}
        actionVisibility="always"
        action={
          <Box className="project-health__row-actions">
            <Button size="sm" variant="secondary" onClick={() => actions.moveToRole([finding])}>
              {HEALTH_TEXT.moveToRole}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => actions.show(finding.path)}>
              {HEALTH_TEXT.show}
            </Button>
          </Box>
        }
      />
    ))}
  </HealthSection>
);

export { MisplacedSection };
