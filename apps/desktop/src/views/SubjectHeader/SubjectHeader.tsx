/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../properties-subject/properties-subject.constants';
import { useSubject } from '../../properties-subject/useSubject';
import { SubjectHead } from './sub-components/SubjectHead';
import './SubjectHeader.css';

const SubjectHeader = () => {
  const state = useSubject();
  if (state.status === 'none') return null;
  if (state.status === 'missing') {
    return (
      <Text as="span" variant="subtitle" tone="muted">
        {SUBJECT_TEXT.missingTitle}
      </Text>
    );
  }
  return <SubjectHead subject={state.subject} />;
};

export { SubjectHeader };
