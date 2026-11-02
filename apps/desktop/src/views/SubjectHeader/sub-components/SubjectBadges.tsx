/* @layer renderer-app @kind component */
import { Box, Tag } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../../properties-subject/properties-subject.constants';
import type { SubjectHeaderPartProps } from '../SubjectHeader.type';

const SubjectBadges = ({ subject }: SubjectHeaderPartProps) => {
  const { focus, dirty, inProject } = subject;
  if (!dirty && !focus.readOnly && inProject) return null;
  return (
    <Box className="subject-header__badges">
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
