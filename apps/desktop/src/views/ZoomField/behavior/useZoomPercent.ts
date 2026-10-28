/* @layer renderer-app @kind hook */
import { useViewFeedStore } from '../../../stores/useViewFeedStore';

const useZoomPercent = (): number | null => useViewFeedStore((state) => (state.view ? Math.round(state.view.zoom * 100) : null));

export { useZoomPercent };
