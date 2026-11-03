/* @layer renderer-app @kind hook */
import { useShallow } from 'zustand/react/shallow';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import type { NavigatorFacts } from '../Navigator.type';
import { navigatorFacts } from './navigator-facts';

const useNavigatorFacts = (): NavigatorFacts | null => useViewFeedStore(useShallow((state) => navigatorFacts(state.view)));

export { useNavigatorFacts };
