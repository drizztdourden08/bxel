/* @layer renderer-app @kind component */
import { Box, Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { LinkFinding } from '../../../project-health/project-health.type';
import type { HealthActions } from '../ProjectHealth.type';
import { HealthSection } from './HealthSection';

type LinkSectionProps = {
  readonly findings: readonly LinkFinding[];
  readonly actions: HealthActions;
  readonly title: string;
  readonly hint: string;
  readonly moved: boolean;
};

const metaOf = (finding: LinkFinding): string => {
  if (finding.foundPath !== null) return `${HEALTH_TEXT.lastPath(finding.lastPath)}. ${HEALTH_TEXT.foundAt(finding.foundPath)}`;
  if (finding.candidates.length > 1) return `${HEALTH_TEXT.lastPath(finding.lastPath)}. ${HEALTH_TEXT.candidates(finding.candidates)}`;
  return HEALTH_TEXT.lastPath(finding.lastPath);
};

const LinkSection = ({ findings, actions, title, hint, moved }: LinkSectionProps) => (
  <HealthSection
    title={title}
    hint={hint}
    count={findings.length}
    actions={
      moved ? (
        <Button size="sm" variant="primary" onClick={actions.fixMoved}>
          {HEALTH_TEXT.fixAll}
        </Button>
      ) : undefined
    }
  >
    {findings.map((finding) => (
      <ListItemRow
        key={finding.fix}
        icon={<Icon name={iconOfKind(finding.fileKind)} />}
        name={HEALTH_TEXT.linkLine(finding.fileName, finding.targetName)}
        meta={metaOf(finding)}
        actionVisibility="always"
        action={
          <Box className="project-health__row-actions">
            {moved && (
              <Button size="sm" variant="secondary" onClick={() => actions.fixLink(finding, 'id')}>
                {HEALTH_TEXT.findById}
              </Button>
            )}
            {!moved && (
              <Button size="sm" variant="secondary" onClick={() => actions.fixLink(finding, 'remove')}>
                {HEALTH_TEXT.removeLink}
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => actions.show(finding.file)}>
              {HEALTH_TEXT.show}
            </Button>
          </Box>
        }
      />
    ))}
  </HealthSection>
);

export { LinkSection };
