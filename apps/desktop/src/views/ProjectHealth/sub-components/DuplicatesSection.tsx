/* @layer renderer-app @kind component */
import { Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { fileName } from '../../../files/file-name';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';

const DuplicatesSection = ({ report, actions }: ReportProps) => (
  <HealthSection title={HEALTH_TEXT.duplicatesTitle} hint={HEALTH_TEXT.duplicatesHint} count={report.duplicates.length}>
    {report.duplicates.map((duplicate) => (
      <ListItemRow
        key={duplicate.assetId}
        icon={<Icon name="copy" />}
        name={duplicate.paths.map(fileName).join(', ')}
        meta={HEALTH_TEXT.sharedBy(duplicate.paths)}
        actionVisibility="always"
        action={
          <Button size="sm" variant="ghost" onClick={() => actions.show(duplicate.paths[0] ?? '')}>
            {HEALTH_TEXT.show}
          </Button>
        }
      />
    ))}
  </HealthSection>
);

export { DuplicatesSection };
