/* @layer renderer-app @kind hook */
import { useShallow } from 'zustand/react/shallow';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import type { ImageRect } from '../Navigator.type';
import { visibleRect } from './visible-rect';

const useOtherViewRect = (): ImageRect | null => useViewFeedStore(useShallow((state) => (state.other ? visibleRect(state.other) : null)));

export { useOtherViewRect };
