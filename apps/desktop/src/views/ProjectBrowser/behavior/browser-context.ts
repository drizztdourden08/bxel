/* @layer renderer-app @kind logic */
import { createContext, useContext } from 'react';
import type { BrowserContextValue } from '../ProjectBrowser.type';

const BrowserContext = createContext<BrowserContextValue | null>(null);

const useBrowserContext = (): BrowserContextValue => {
  const value = useContext(BrowserContext);
  if (value === null) throw new Error('The browser parts must sit inside ProjectBrowser.');
  return value;
};

export { BrowserContext, useBrowserContext };
