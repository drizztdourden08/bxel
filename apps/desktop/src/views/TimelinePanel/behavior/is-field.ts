/* @layer renderer-app @kind logic */
import { FIELD } from './is-field.constants';

const isField = (target: EventTarget): boolean => target instanceof Element && target.closest(FIELD) !== null;

export { isField };
