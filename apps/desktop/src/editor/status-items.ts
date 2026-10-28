/* @layer renderer-app @kind logic */
import type { StatusBarEntry } from '@drizztdourden08/tessera';
import { extraItems } from '../status-extras/extra-items';
import type { PaletteSlot } from './palette-slots.type';
import type { StatusInput } from './status.type';
import { HELP_PRIORITY, STATUS_TEXT } from './status.constants';

const colourEntry = (colour: PaletteSlot | null, position: 1 | 2): StatusBarEntry => ({
  id: `colour-${position}`,
  label: STATUS_TEXT.colourLabel(position),
  value: colour ? STATUS_TEXT.colour(colour.index, colour.name) : STATUS_TEXT.outside,
  swatch: colour && !colour.transparent ? colour.hex : undefined,
  priority: position === 1 ? 1 : 2,
});

const statusItems = (input: StatusInput): StatusBarEntry[] => {
  const { pointer, zoom, colours, clean, recovered, extras } = input;
  const recovery: StatusBarEntry[] = recovered && !clean ? [{ id: 'recovered', label: 'Recovery', value: STATUS_TEXT.recovered, tone: 'warning', align: 'end' }] : [];
  return [
    { id: 'cursor', label: 'Cursor', value: pointer ? STATUS_TEXT.cursor(pointer) : STATUS_TEXT.outside },
    ...(extras ? extraItems(extras) : []),
    { id: 'zoom', label: 'Zoom', value: STATUS_TEXT.zoom(zoom) },
    colourEntry(colours[0], 1),
    colourEntry(colours[1], 2),
    {
      id: 'saved',
      label: 'File',
      value: clean ? STATUS_TEXT.saved : STATUS_TEXT.unsaved,
      tone: clean ? undefined : 'warning',
      align: 'end',
    },
    ...recovery,
    { id: 'help', label: STATUS_TEXT.help, value: STATUS_TEXT.helpValue, icon: 'circle-help', align: 'end', priority: HELP_PRIORITY },
  ];
};

export { statusItems };
