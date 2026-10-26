/* @layer renderer-app @kind logic */
const FIELD = 'input, textarea, select, [contenteditable="true"], [role="combobox"], [role="listbox"], [role="slider"]';

const isField = (target: EventTarget): boolean => target instanceof Element && target.closest(FIELD) !== null;

export { isField };
