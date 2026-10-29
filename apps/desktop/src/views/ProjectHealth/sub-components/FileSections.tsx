/* @layer renderer-app @kind component */
import { Box, Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { fileName } from '../../../files/file-name';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { ReportProps } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';

const FileSections = ({ report, actions }: ReportProps) => (
  <>
    {report.unused.length > 0 && (
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
            meta={finding.path}
            actionVisibility="always"
            action={
              <Button size="sm" variant="ghost" onClick={() => actions.show(finding.path)}>
                {HEALTH_TEXT.show}
              </Button>
            }
          />
        ))}
      </HealthSection>
    )}
    {report.misplaced.length > 0 && (
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
    )}
    {report.duplicates.length > 0 && (
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
    )}
  </>
);

export { FileSections };
