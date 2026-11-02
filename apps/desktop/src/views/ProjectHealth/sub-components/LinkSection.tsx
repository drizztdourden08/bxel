/* @layer renderer-app @kind component */
import { Box, Button, Icon, ListItemRow } from '@drizztdourden08/tessera';
import { iconOfKind } from '../../../project-health/icon-of-kind';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import type { LinkFinding } from '../../../project-health/project-health.type';
import { HealthSection } from './HealthSection';
import type { LinkSectionProps } from './LinkSection.type';
import { PathMeta } from './PathMeta';

const metaOf = (finding: LinkFinding) => (show: (path: string) => string): string => {
  const last = HEALTH_TEXT.lastPath(show(finding.lastPath));
  if (finding.foundPath !== null) return `${last}. ${HEALTH_TEXT.foundAt(show(finding.foundPath))}`;
  return finding.candidates.length > 1 ? `${last}. ${HEALTH_TEXT.candidates(finding.candidates.map(show))}` : last;
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
        meta={<PathMeta build={metaOf(finding)} />}
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
            <Button size="sm" variant="secondary" onClick={() => actions.pickFile(finding)}>
              {HEALTH_TEXT.pickFile}
            </Button>
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
