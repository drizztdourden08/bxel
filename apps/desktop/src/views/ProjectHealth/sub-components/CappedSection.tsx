/* @layer renderer-app @kind component */
import { Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import { MAX_WORKSPACE_ASSETS } from '../../../workspace/workspace.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';
import { PathMeta } from './PathMeta';

const CappedSection = ({ report, actions }: ReportProps) => (
  <HealthSection title={HEALTH_TEXT.cappedTitle} hint={HEALTH_TEXT.cappedHint(MAX_WORKSPACE_ASSETS)} count={report.capped.length}>
    {report.capped.map((finding) => (
      <ListItemRow
        key={finding.fix}
        icon={<Icon name={iconOfKind(finding.kind)} />}
        name={finding.name}
        meta={<PathMeta build={(show) => show(finding.path)} />}
        actionVisibility="always"
        action={
          <Button size="sm" variant="ghost" onClick={() => actions.show(finding.path)}>
            {HEALTH_TEXT.show}
          </Button>
        }
      />
    ))}
  </HealthSection>
);

export { CappedSection };
