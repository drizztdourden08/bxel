/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';

const renameKey = (event: KeyboardEvent<HTMLElement>): void => {
  if (event.key !== 'F2') return;
  const start = event.currentTarget.querySelector<HTMLElement>('.swatch-list__name button');
  if (!start) return;
  event.preventDefault();
  start.click();
};

export { renameKey };
