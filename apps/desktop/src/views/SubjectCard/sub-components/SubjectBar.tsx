/* @layer renderer-app @kind component */
import { Box, Button, Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../../properties-subject/properties-subject.constants';
import { openSubject } from '../../../properties-subject/open-subject';
import { saveSubject } from '../../../properties-subject/save-subject';
import { togglePin } from '../../../properties-subject/toggle-pin';
import { useSubjectStore } from '../../../properties-subject/useSubjectStore';
import type { SubjectPartProps } from '../SubjectCard.type';

const SubjectBar = ({ subject }: SubjectPartProps) => {
  const canBack = useSubjectStore((state) => state.past.length > 0);
  const canForward = useSubjectStore((state) => state.future.length > 0);
  return (
    <Box className="subject-card__bar" role="group" aria-label={subject.pinned ? SUBJECT_TEXT.pinnedTo : SUBJECT_TEXT.follows}>
      <IconButton
        label={subject.pinned ? SUBJECT_TEXT.unpin : SUBJECT_TEXT.pin}
        size="sm"
        variant={subject.pinned ? 'primary' : 'tertiary'}
        active={subject.pinned}
        aria-pressed={subject.pinned}
        onClick={() => togglePin(subject)}
      >
        <Icon name={subject.pinned ? 'pin' : 'pin-off'} />
      </IconButton>
      <Text as="span" variant="caption" tone="muted" className="subject-card__pin-note">
        {subject.pinned ? SUBJECT_TEXT.pinnedTo : SUBJECT_TEXT.follows}
      </Text>
      <IconButton label={SUBJECT_TEXT.back} size="sm" variant="tertiary" disabled={!canBack} onClick={() => useSubjectStore.getState().back()}>
        <Icon name="chevron-left" />
      </IconButton>
      <IconButton label={SUBJECT_TEXT.forward} size="sm" variant="tertiary" disabled={!canForward} onClick={() => useSubjectStore.getState().forward()}>
        <Icon name="chevron-right" />
      </IconButton>
      {!subject.hasTab && (
        <Button size="sm" variant="secondary" onClick={() => openSubject(subject)}>
          {SUBJECT_TEXT.open}
        </Button>
      )}
      {subject.dirty && subject.path !== null && (
        <Button size="sm" variant="primary" onClick={() => void saveSubject(subject)}>
          {SUBJECT_TEXT.save}
        </Button>
      )}
    </Box>
  );
};

export { SubjectBar };
