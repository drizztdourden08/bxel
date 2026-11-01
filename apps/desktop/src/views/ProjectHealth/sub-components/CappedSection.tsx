/* @layer renderer-app @kind component */
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import { MAX_WORKSPACE_ASSETS } from '../../../workspace/workspace.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { FileRows } from './FileRows';
import { HealthSection } from './HealthSection';

const CappedSection = ({ report, actions }: ReportProps) => (
  <HealthSection title={HEALTH_TEXT.cappedTitle} hint={HEALTH_TEXT.cappedHint(MAX_WORKSPACE_ASSETS)} count={report.capped.length}>
    <FileRows findings={report.capped} show={actions.show} />
  </HealthSection>
);

export { CappedSection };
