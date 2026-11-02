/* @layer renderer-app @kind component */
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { FileRows } from './FileRows';
import { HealthSection } from './HealthSection';

const RekeyedSection = ({ report, actions }: ReportProps) => (
  <HealthSection title={HEALTH_TEXT.rekeyedTitle} hint={HEALTH_TEXT.rekeyedHint} count={report.rekeyed.length}>
    <FileRows findings={report.rekeyed} show={actions.show} />
  </HealthSection>
);

export { RekeyedSection };
