/* @layer renderer-app @kind logic */
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { OPTIONS_HUB, PROJECT_HUB, PROPERTIES_HUB } from '../../config-entry/config-entry.constants';
import { readSubject } from '../../properties-subject/read-subject';
import { useProjectStore } from '../../stores/useProjectStore';
import { placeOfPath } from './place-of-path';

const HUBS: readonly string[] = [PROJECT_HUB, PROPERTIES_HUB, OPTIONS_HUB];

const pageOf = (section: unknown): string | null => (typeof section === 'string' && section !== '' ? section : null);

const windowView = () => {
  const { active, params } = useNavigationStore.getState();
  if (active === null || !HUBS.includes(active)) return { open: null, page: null, subject: null };
  const state = active === PROPERTIES_HUB ? readSubject() : null;
  const path = state?.status === 'ready' ? state.subject.path : null;
  return { open: active, page: pageOf(params.section), subject: path === null ? null : placeOfPath(useProjectStore.getState().project, path) };
};

export { windowView };
