/* @layer renderer-app @kind component */
import { Box, Button, EmptyState } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../../properties-subject/properties-subject.constants';
import { useSubjectStore } from '../../../properties-subject/useSubjectStore';

const MissingNotice = () => (
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

export { MissingNotice };
