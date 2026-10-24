/* @layer renderer-app @kind logic */
import { opaqueSlots } from '../palette-limit/opaque-slots';
import { IMPORT_TEXT } from './image-import.constants';
import type { ImportContext, ImportForm, ReduceOption } from './image-import.type';

const reduceOptions = (form: ImportForm, context: ImportContext): ReduceOption[] => {
  const map: ReduceOption[] = context.bank && form.target === 'file' ? [{ value: 'map', label: IMPORT_TEXT.map(context.bank.name) }] : [];
  return [
    ...map,
    { value: 'extract', label: IMPORT_TEXT.extract(opaqueSlots(form.limit, form.transparent)) },
    { value: 'palette', label: IMPORT_TEXT.palette },
  ];
};

export { reduceOptions };
