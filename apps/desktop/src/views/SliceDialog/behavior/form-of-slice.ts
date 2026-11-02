/* @layer renderer-app @kind logic */
import type { Slice } from '@bxel/document';
import { SLICE_COLOUR_START } from '../SliceDialog.constants';
import type { SliceForm } from '../SliceDialog.type';

const formOfSlice = (slice: Slice): SliceForm => ({
  name: slice.name,
  rect: slice.rect,
  pivotOn: slice.pivot !== null,
  pivot: slice.pivot ?? { x2: slice.rect.width, y2: slice.rect.height },
  centreOn: slice.center !== null,
  centre: slice.center ?? { x: 0, y: 0, width: slice.rect.width, height: slice.rect.height },
  colourOn: slice.colour !== undefined,
  colour: slice.colour ?? SLICE_COLOUR_START,
});

export { formOfSlice };
