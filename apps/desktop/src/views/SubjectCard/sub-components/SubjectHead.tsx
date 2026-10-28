/* @layer renderer-app @kind component */
import { Box, Icon, Link, Text } from '@drizztdourden08/tessera';
import { KIND_ICON } from '../../../asset-list/asset-list.constants';
import { OVERVIEW_KIND_LABEL } from '../../../asset-overview/asset-overview.constants';
import { SUBJECT_TEXT } from '../../../properties-subject/properties-subject.constants';
import { revealInProjectWindow } from '../../../project-browser/reveal-in-project-window';
import type { SubjectPartProps } from '../SubjectCard.type';
import { SubjectBadges } from './SubjectBadges';

const SubjectHead = ({ subject }: SubjectPartProps) => {
  const kind = subject.kind === 'project' ? 'other' : subject.kind;
  return (
    <Box className="subject-card__head">
      <Icon className="subject-card__icon" name={KIND_ICON[kind]} size="lg" />
      <Box className="subject-card__titles">
        <Text as="h2" variant="subtitle" className="subject-card__name" title={subject.name}>
          {subject.name}
        </Text>
        <Box className="subject-card__path">
          <Text as="span" variant="caption" tone="muted">
            {OVERVIEW_KIND_LABEL[subject.kind]}
          </Text>
          {subject.relativePath === null ? (
            <Text as="span" variant="caption" tone="muted">
              {SUBJECT_TEXT.unsavedPath}
            </Text>
          ) : (
            <Link href="#" variant="subtle" title={SUBJECT_TEXT.showInProject} onClick={(event) => {
              event.preventDefault();
              if (subject.path !== null) revealInProjectWindow(subject.path);
            }}>
              {subject.relativePath}
            </Link>
          )}
        </Box>
        <SubjectBadges subject={subject} />
      </Box>
    </Box>
  );
};

export { SubjectHead };
