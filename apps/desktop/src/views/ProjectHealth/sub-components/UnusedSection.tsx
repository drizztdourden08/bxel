/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { FileRows } from './FileRows';
import { HealthSection } from './HealthSection';

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
    <FileRows findings={report.unused} show={actions.show} />
  </HealthSection>
);

export { UnusedSection };
