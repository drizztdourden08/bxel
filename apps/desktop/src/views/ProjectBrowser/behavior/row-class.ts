/* @layer renderer-app @kind logic */
const flag = (on: boolean, name: string): string => (on ? ` ${name}` : '');

const rowClass = (state: { readonly column: boolean; readonly lit: boolean; readonly over: boolean }): string =>
  `browser-row${flag(state.column, 'browser-row--column')}${flag(state.lit, 'browser-row--selected')}${flag(state.over, 'browser-row--drop')}`;

export { rowClass };
