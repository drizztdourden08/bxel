/* @layer renderer-app @kind component */
import { Box, Button, EmptyState } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../properties-subject/properties-subject.constants';
import { useSubject } from '../../properties-subject/useSubject';
import { useSubjectStore } from '../../properties-subject/useSubjectStore';
import { SubjectBar } from './sub-components/SubjectBar';
import { SubjectHead } from './sub-components/SubjectHead';
import { SubjectPreview } from './sub-components/SubjectPreview';
import './SubjectCard.css';

const SubjectCard = () => {
  const state = useSubject();
  if (state.status === 'none') return null;
  if (state.status === 'missing') {
    return (
      <Box className="subject-card">
        <EmptyState
          size="sm"
          title={SUBJECT_TEXT.missingTitle}
          message={SUBJECT_TEXT.missingMessage}
          action={
            <Button size="sm" variant="secondary" onClick={() => useSubjectStore.getState().unpin()}>
              {SUBJECT_TEXT.unpin}
            </Button>
          }
        />
      </Box>
    );
  }
  const { subject } = state;
  return (
    <Box className="subject-card" role="region" aria-label={subject.name}>
      <SubjectHead subject={subject} />
      <SubjectBar subject={subject} />
      <SubjectPreview subject={subject} />
    </Box>
  );
};

export { SubjectCard };
