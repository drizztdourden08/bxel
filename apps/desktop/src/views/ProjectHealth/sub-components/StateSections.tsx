/* @layer renderer-app @kind component */
import { Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';

const StateSections = ({ report, actions }: ReportProps) => (
  <>
    {report.unsaved > 0 && (
      <HealthSection title={HEALTH_TEXT.unsavedTitle} hint={HEALTH_TEXT.unsavedHint} count={report.unsaved}>
        <ListItemRow
          icon={<Icon name="save" />}
          name={HEALTH_TEXT.unsavedCount(report.unsaved)}
          actionVisibility="always"
          action={
            <Button size="sm" variant="secondary" onClick={actions.showUnsaved}>
              {HEALTH_TEXT.showFiles}
            </Button>
          }
        />
      </HealthSection>
    )}
    {report.access.length > 0 && (
      <HealthSection title={HEALTH_TEXT.accessTitle} hint={HEALTH_TEXT.accessHint} count={report.access.length}>
        {report.access.map((finding) => (
          <ListItemRow
            key={finding.fix}
            icon={<Icon name="folder" />}
            name={finding.name}
            meta={finding.path}
            actionVisibility="always"
            action={
              <Button size="sm" variant="secondary" onClick={() => actions.regrant(finding)}>
                {HEALTH_TEXT.regrant}
              </Button>
            }
          />
        ))}
      </HealthSection>
    )}
  </>
);

export { StateSections };
