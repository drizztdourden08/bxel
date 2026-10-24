/* @layer renderer-app @kind logic */
const tileClass = (active: boolean, affected: boolean): string =>
  ['sprites-panel__tile', active ? 'sprites-panel__tile--active' : '', affected ? 'sprites-panel__tile--affected' : '']
    .filter(Boolean)
    .join(' ');

export { tileClass };
