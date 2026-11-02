/* @layer renderer-app @kind component */
import { useSubject } from '../../../properties-subject/useSubject';
import { SubjectBar } from './SubjectBar';

const SubjectHeaderActions = () => {
  const state = useSubject();
  return state.status === 'ready' ? <SubjectBar subject={state.subject} /> : null;
};

export { SubjectHeaderActions };
