/* @layer renderer-app @kind constants */
import type { SegmentOption } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../EntryBrowser.constants';
import type { BrowserView } from '../EntryBrowser.type';

const VIEWS: SegmentOption<BrowserView>[] = [
  { value: 'grid', icon: 'pixel-grid-view', title: BROWSER_TEXT.grid, hint: { label: BROWSER_TEXT.grid, description: BROWSER_TEXT.grid } },
  { value: 'list', icon: 'pixel-list-view', title: BROWSER_TEXT.list, hint: { label: BROWSER_TEXT.list, description: BROWSER_TEXT.list } },
];

export { VIEWS };
