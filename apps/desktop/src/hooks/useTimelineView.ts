/* @layer renderer-app @kind hook */
import { useSettings, useWidgetState } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import type { AppSettings } from '../settings.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import type { AnimationFocus } from '../timeline/timeline.type';
import { readSavedView } from '../timeline/read-saved-view';
import { readZoom } from '../timeline/read-zoom';
import { EMPTY_VIEW } from '../timeline/saved-view.constants';
import type { SavedView } from '../timeline/saved-view.type';

const useTimelineView = (focus: AnimationFocus): void => {
  const { settings } = useSettings<AppSettings>();
  const [raw, save] = useWidgetState<SavedView>('view', EMPTY_VIEW, { scope: `doc:${focus.documentId}` });
  const animationId = focus.animation.id;
  const latest = useRef({ raw, settings });
  const applied = useRef<string | null>(null);
  useEffect(() => {
    latest.current = { raw, settings };
  }, [raw, settings]);

  useEffect(() => {
    const view = readSavedView(latest.current.raw);
    applied.current = animationId;
    useTimelineStore.setState({ zoom: view.zooms[animationId] ?? readZoom(latest.current.settings), fit: false, timeMode: view.timeMode, units: view.units });
  }, [animationId]);

  useEffect(
    () =>
      useTimelineStore.subscribe((state, previous) => {
        const changed = state.zoom !== previous.zoom || state.timeMode !== previous.timeMode || state.units !== previous.units;
        if (!changed || applied.current !== animationId) return;
        const view = readSavedView(latest.current.raw);
        const zooms = state.fit ? view.zooms : { ...view.zooms, [animationId]: state.zoom };
        save({ zooms, timeMode: state.timeMode, units: state.units });
      }),
    [animationId, save],
  );
};

export { useTimelineView };
