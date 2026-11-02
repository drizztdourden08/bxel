/* @layer renderer-app @kind component */
import { Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';
import { PathMeta } from './PathMeta';

const RepairedSection = ({ report, actions }: ReportProps) => (
  <HealthSection title={HEALTH_TEXT.repairedTitle} hint={HEALTH_TEXT.repairedHint} count={report.repaired.length}>
    {report.repaired.map((finding) => (
      <ListItemRow
        key={finding.fix}
        icon={<Icon name={iconOfKind(finding.fileKind)} />}
        name={HEALTH_TEXT.repairedLine(finding.fileName, finding.targetName)}
        meta={<PathMeta build={(show) => HEALTH_TEXT.foundAt(show(finding.foundPath ?? finding.lastPath))} />}
        actionVisibility="always"
        action={
          <Button size="sm" variant="ghost" onClick={() => actions.show(finding.file)}>
            {HEALTH_TEXT.show}
          </Button>
        }
      />
    ))}
  </HealthSection>
);

export { RepairedSection };
