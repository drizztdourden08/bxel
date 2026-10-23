/* @layer renderer-app @kind logic */
import type { StatusBarEntry } from '@drizztdourden08/tessera';
import type { StatusInput } from './status.type';
import { STATUS_TEXT } from './status.constants';

const statusItems = (input: StatusInput): StatusBarEntry[] => {
  const { pointer, zoom, colour, clean } = input;
  return [
    { id: 'cursor', label: 'Cursor', value: pointer ? STATUS_TEXT.cursor(pointer) : STATUS_TEXT.outside },
    { id: 'zoom', label: 'Zoom', value: STATUS_TEXT.zoom(zoom) },
    {
      id: 'colour',
      label: 'Colour',
      value: colour ? STATUS_TEXT.colour(colour.index, colour.name) : STATUS_TEXT.outside,
      swatch: colour && !colour.transparent ? colour.hex : undefined,
    },
    {
      id: 'saved',
      label: 'File',
      value: clean ? STATUS_TEXT.saved : STATUS_TEXT.unsaved,
      tone: clean ? undefined : 'warning',
      align: 'end',
    },
  ];
};

export { statusItems };
