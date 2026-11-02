/* @layer renderer-app @kind logic */
import { nav, useNavigationStore } from '@drizztdourden08/brock-react';
import { PROPERTIES_HUB } from '../config-entry/config-entry.constants';
import { pinParamsOf } from './pin-params-of';
import type { SubjectRef } from './properties-subject.type';
import { refToParams } from './subject-params';

const writePin = (ref: SubjectRef | null, route?: string): void => {
  const state = useNavigationStore.getState();
  const showing = state.active === PROPERTIES_HUB;
  if (showing || route !== undefined) {
    nav.open(route ?? PROPERTIES_HUB, showing ? { ...state.params, ...refToParams(ref) } : refToParams(ref));
    return;
  }
  useNavigationStore.setState({ remembered: { ...state.remembered, [PROPERTIES_HUB]: { ...pinParamsOf(state), ...refToParams(ref) } } });
};

export { writePin };
