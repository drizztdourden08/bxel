/* @layer renderer-app @kind logic */
import { createContext } from 'react';
import type { BrowserContextValue } from '../ProjectBrowser.type';

const BrowserContext = createContext<BrowserContextValue | null>(null);

export { BrowserContext };
