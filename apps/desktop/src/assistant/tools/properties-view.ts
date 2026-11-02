/* @layer renderer-app @kind logic */
import { readSubject } from '../../properties-subject/read-subject';
import { readPin } from '../../properties-subject/read-pin';
import { useSubjectStore } from '../../properties-subject/useSubjectStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { placeOfPath } from './place-of-path';

const propertiesView = () => {
  const state = readSubject();
  const { past, future } = useSubjectStore.getState();
  const pin = readPin();
  const { project } = useProjectStore.getState();
  const base = { status: state.status, pinned: pin !== null, back: past.length, forward: future.length };
  if (state.status === 'ready') {
    const { subject } = state;
    return { ...base, subject: { kind: subject.kind, name: subject.name, file: subject.path === null ? null : placeOfPath(project, subject.path), dirty: subject.dirty, open: subject.hasTab } };
  }
  const path = state.status === 'missing' ? state.ref.path : null;
  return { ...base, subject: null, missing: path === null ? null : placeOfPath(project, path) };
};

export { propertiesView };
