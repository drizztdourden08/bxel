/* @layer renderer-app @kind component */
import { Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';
import { PathMeta } from './PathMeta';

const UnusedSection = ({ report, actions }: ReportProps) => (
  <HealthSection
    title={HEALTH_TEXT.unusedTitle}
    hint={HEALTH_TEXT.unusedHint}
    count={report.unused.length}
    actions={
      <>
        <Button size="sm" variant="secondary" onClick={actions.showUnused}>
          {HEALTH_TEXT.showFiles}
        </Button>
        <Button size="sm" variant="danger" onClick={() => actions.trashUnused(report.unused)}>
          {HEALTH_TEXT.trashAll}
        </Button>
      </>
    }
  >
    {report.unused.map((finding) => (
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

export { UnusedSection };
