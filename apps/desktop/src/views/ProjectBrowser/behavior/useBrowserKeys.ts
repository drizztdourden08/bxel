/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import type { BrowserActions } from '../ProjectBrowser.type';
import { browserChord } from './browser-chord';
import { browserCommands } from './browser-commands';

const typing = (event: KeyboardEvent): boolean => event.target instanceof HTMLElement && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA');

const useBrowserKeys = (model: BrowserModel, actions: BrowserActions) => (event: KeyboardEvent): void => {
  if (typing(event)) return;
  const run = Object.entries(browserCommands(model, actions)).find(([chord]) => chord === browserChord(event))?.[1];
  if (!run) return;
  event.preventDefault();
  run();
};

export { useBrowserKeys };
