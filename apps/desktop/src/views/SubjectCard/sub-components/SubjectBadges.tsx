/* @layer renderer-app @kind component */
import { Box, Tag } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../../properties-subject/properties-subject.constants';
import type { SubjectPartProps } from '../SubjectCard.type';

const SubjectBadges = ({ subject }: SubjectPartProps) => {
  const { focus, dirty, inProject } = subject;
  if (!dirty && !focus.readOnly && inProject) return null;
  return (
    <Box className="subject-card__badges">
      {dirty && (
        <Tag variant="urgency" color="warning">
          {SUBJECT_TEXT.unsaved}
        </Tag>
      )}
      {focus.readOnly && <Tag>{SUBJECT_TEXT.readOnly}</Tag>}
      {!inProject && <Tag>{SUBJECT_TEXT.notInProject}</Tag>}
    </Box>
  );
};

export { SubjectBadges };
