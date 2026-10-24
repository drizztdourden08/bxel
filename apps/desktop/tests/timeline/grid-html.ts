/* @layer renderer-app @kind test */
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { timelineModel } from '../../src/timeline/timeline-model';
import { TimelineGrid } from '../../src/views/TimelinePanel/sub-components/TimelineGrid';
import { live } from './timeline-harness';

Object.assign(globalThis, { React });

const gridHtml = (): string => {
  const { selection, tagId } = useTimelineStore.getState();
  const target = live();
  return renderToString(createElement(TimelineGrid, { model: timelineModel(target, selection, tagId), frameId: target.frameId }));
};

export { gridHtml };
