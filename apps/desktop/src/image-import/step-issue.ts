/* @layer renderer-app @kind logic */
import { IMPORT_TEXT } from './image-import.constants';
import type { ColorsView, ImportErrors, ImportStep } from './image-import.type';

const stepIssue = (step: ImportStep, errors: ImportErrors, view: ColorsView): string | null => {
  if (step === 'source') return errors.name ?? errors.size;
  if (step === 'colors') return view.warning ?? errors.limit ?? errors.palette ?? (view.plan ? null : IMPORT_TEXT.noMapping);
  return errors.slice ?? errors.naming;
};

export { stepIssue };
