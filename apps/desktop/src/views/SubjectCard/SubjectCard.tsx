/* @layer renderer-app @kind component */
import { Box, Button, EmptyState } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../properties-subject/properties-subject.constants';
import { useSubject } from '../../properties-subject/useSubject';
import { useSubjectStore } from '../../properties-subject/useSubjectStore';
import { AssetPreview } from '../AssetPreview';
import { useSubjectPreview } from './behavior/useSubjectPreview';
import { SubjectBar } from './sub-components/SubjectBar';
import { SubjectHead } from './sub-components/SubjectHead';
import type { SubjectPartProps } from './SubjectCard.type';
import './SubjectCard.css';

const SubjectPreview = ({ subject }: SubjectPartProps) => {
  const { preview, loop } = useSubjectPreview(subject);
  return <AssetPreview key={`${subject.focus.key.kind}:${subject.focus.key.id}`} preview={preview} name={subject.name} loop={loop} mode="compact" />;
};

/** The subject of the Properties window: the file it is about, its preview, and the pin that holds it. */
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
