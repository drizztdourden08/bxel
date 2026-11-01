/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { CappedSection } from './CappedSection';
import { DuplicatesSection } from './DuplicatesSection';
import { LinkSection } from './LinkSection';
import { MisplacedSection } from './MisplacedSection';
import { StateSections } from './StateSections';
import { UnusedSection } from './UnusedSection';

const HealthBody = ({ report, actions }: ReportProps) => (
  <>
    {report.total === 0 && <EmptyState size="sm" title={HEALTH_TEXT.allGood} message={HEALTH_TEXT.allGoodMessage(report.files)} />}
    {report.broken.length > 0 && <LinkSection findings={report.broken} actions={actions} title={HEALTH_TEXT.brokenTitle} hint={HEALTH_TEXT.brokenHint} moved={false} />}
    {report.moved.length > 0 && <LinkSection findings={report.moved} actions={actions} title={HEALTH_TEXT.movedTitle} hint={HEALTH_TEXT.movedHint} moved />}
    {report.unused.length > 0 && <UnusedSection report={report} actions={actions} />}
    {report.misplaced.length > 0 && <MisplacedSection report={report} actions={actions} />}
    {report.duplicates.length > 0 && <DuplicatesSection report={report} actions={actions} />}
    {report.capped.length > 0 && <CappedSection report={report} actions={actions} />}
    <StateSections report={report} actions={actions} />
  </>
);

export { HealthBody };
