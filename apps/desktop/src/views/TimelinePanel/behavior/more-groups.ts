/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { FACING_SETS } from '@bxel/document';
import { nav } from '@drizztdourden08/brock-react';
import { useAddFramesStore } from '../../../stores/useAddFramesStore';
import { useDirectionSetStore } from '../../../stores/useDirectionSetStore';
import { THUMB_SIZES } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { addFrame } from '../../../timeline/add-frame';
import { duplicateFrames } from '../../../timeline/duplicate-frames';
import { exportFrames } from '../../../timeline/export-frames';
import { facingTag } from '../../../timeline/facing-tag';
import { makeSpritesheet } from '../../../timeline/make-spritesheet';
import { pickFacing } from '../../../timeline/pick-facing';
import { splitToSprites } from '../../../timeline/split-to-sprites';
import { ADD_TEXT } from '../../../add-frames/add-frames.constants';
import { FACING_TEXT } from '../../../timeline/timeline.constants';
import type { AnimationFocus } from '../../../timeline/timeline.type';
import { TIMELINE_PANEL_TEXT, TRANSFORM_TEXT } from '../TimelinePanel.constants';
import { ANIMATION_PAGE } from './more-groups.constants';

const frameGroup = (disabled: boolean): MenuGroup => ({
  id: 'frames',
  items: [
    { id: 'blank', label: ADD_TEXT.blank, disabled, onSelect: addFrame },
    { id: 'duplicate', label: ADD_TEXT.duplicate, disabled, onSelect: duplicateFrames },
    {
      id: 'add-from',
      label: ADD_TEXT.menu,
      disabled,
      children: [
        { id: 'sprites', label: ADD_TEXT.fromSprites, onSelect: () => useAddFramesStore.getState().show('sprites') },
        { id: 'strip', label: ADD_TEXT.fromStrip, onSelect: () => useAddFramesStore.getState().show('strip') },
        { id: 'sheet', label: ADD_TEXT.fromSheet, onSelect: () => useAddFramesStore.getState().show('sheet') },
      ],
    },
    {
      id: 'transform',
      label: TRANSFORM_TEXT.menu,
      children: [
        { id: 'directions', label: TRANSFORM_TEXT.directions, disabled, onSelect: () => useDirectionSetStore.getState().show() },
        { id: 'spritesheet', label: TRANSFORM_TEXT.spritesheet, onSelect: () => void makeSpritesheet() },
        { id: 'split', label: TRANSFORM_TEXT.split, disabled, onSelect: () => void splitToSprites() },
        { id: 'frames', label: TRANSFORM_TEXT.frames, onSelect: () => exportFrames() },
      ],
    },
  ],
});

const viewGroup = (): MenuGroup => {
  const store = useTimelineStore.getState();
  const { timeMode } = store;
  return {
    id: 'view',
    items: [
      { id: 'time-mode', label: TIMELINE_PANEL_TEXT.timeMode, kind: 'check', checked: timeMode, shortcut: 'T', onSelect: () => store.setTimeMode(!timeMode) },
      { id: 'settings', label: TIMELINE_PANEL_TEXT.settings, onSelect: () => nav.open(ANIMATION_PAGE) },
    ],
  };
};

const foldedGroup = (focus: AnimationFocus): MenuGroup => {
  const store = useTimelineStore.getState();
  const { onion, zoom, fit, tagId } = store;
  const facings = FACING_SETS[focus.animation.directions];
  return {
    id: 'folded',
    items: [
      ...(facings.length === 0
        ? []
        : [
            {
              id: 'facing',
              label: TIMELINE_PANEL_TEXT.facing,
              children: facings.map((facing) => {
                const tag = facingTag(focus.animation, facing);
                return { id: `facing-${facing}`, label: FACING_TEXT[facing], kind: 'radio' as const, checked: tag?.id === tagId, disabled: tag === undefined, onSelect: () => pickFacing(facing) };
              }),
            },
          ]),
      { id: 'onion', label: 'Onion skin', kind: 'check' as const, checked: onion.on, shortcut: 'F3', onSelect: () => store.setOnion({ on: !onion.on }) },
      {
        id: 'zoom',
        label: TIMELINE_PANEL_TEXT.zoom,
        children: [
          ...THUMB_SIZES.map((size) => ({ id: `zoom-${size}`, label: TIMELINE_PANEL_TEXT.zoomSize(size), kind: 'radio' as const, checked: !fit && zoom === size, onSelect: () => store.setZoom(size) })),
          { id: 'zoom-fit', label: TIMELINE_PANEL_TEXT.fit, kind: 'radio' as const, checked: fit, onSelect: () => store.setFit(true) },
        ],
      },
    ],
  };
};

const moreGroups = (focus: AnimationFocus, compact: boolean): MenuGroup[] => [
  frameGroup(focus.readOnly),
  ...(compact ? [foldedGroup(focus)] : []),
  viewGroup(),
];

export { moreGroups };
