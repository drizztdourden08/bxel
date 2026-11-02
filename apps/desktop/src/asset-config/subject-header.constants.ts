/* @layer renderer-app @kind constants */
import type { HubHeaderDef } from '@drizztdourden08/brock-react';
import { createElement } from 'react';
import { SUBJECT_PARAM } from '../properties-subject/properties-subject.constants';
import { SubjectHeader, SubjectHeaderActions } from '../views/SubjectHeader';

const SUBJECT_HEADER: HubHeaderDef = {
  render: () => createElement(SubjectHeader),
  actions: () => createElement(SubjectHeaderActions),
};

const SUBJECT_PARAM_KEYS: string[] = [SUBJECT_PARAM.subject, SUBJECT_PARAM.pin];

export { SUBJECT_HEADER, SUBJECT_PARAM_KEYS };
