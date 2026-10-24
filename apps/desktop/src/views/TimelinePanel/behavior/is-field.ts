/* @layer renderer-app @kind logic */
import { FIELD_SELECTOR } from './is-field.constants';

const isField = (target: EventTarget): boolean => target instanceof HTMLElement && target.closest(FIELD_SELECTOR) !== null;

export { isField };
