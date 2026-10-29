/* @layer renderer-app @kind types */
import type { AssetKey } from '@bxel/document';
import type { BrowserFacts } from '../project-browser/project-browser.type';
import type { StatusMap } from './project-browser.type';

type FilterContext = {
  readonly statuses: StatusMap;
  readonly facts: ReadonlyMap<string, BrowserFacts>;
  readonly keys: ReadonlyMap<string, AssetKey>;
};

export type { FilterContext };
