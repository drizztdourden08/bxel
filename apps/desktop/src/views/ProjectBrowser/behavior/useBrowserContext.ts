/* @layer renderer-app @kind hook */
import { useContext } from 'react';
import type { BrowserContextValue } from '../ProjectBrowser.type';
import { BrowserContext } from './browser-context';

const useBrowserContext = (): BrowserContextValue => {
  const value = useContext(BrowserContext);
  if (value === null) throw new Error('The browser parts must sit inside ProjectBrowser.');
  return value;
};

export { useBrowserContext };
