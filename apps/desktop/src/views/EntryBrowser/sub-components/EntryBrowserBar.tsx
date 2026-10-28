/* @layer renderer-app @kind component */
import { Flex, SearchInput, SegmentedControl, Tag } from '@drizztdourden08/tessera';
import type { SegmentOption } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../EntryBrowser.constants';
import type { BrowserBarProps, BrowserView } from '../EntryBrowser.type';

const VIEWS: SegmentOption<BrowserView>[] = [
  { value: 'grid', icon: 'pixel-grid-view', title: BROWSER_TEXT.grid, hint: { label: BROWSER_TEXT.grid, description: BROWSER_TEXT.grid } },
  { value: 'list', icon: 'pixel-list-view', title: BROWSER_TEXT.list, hint: { label: BROWSER_TEXT.list, description: BROWSER_TEXT.list } },
];

const EntryBrowserBar = ({ state, kinds, searchLabel, patch }: BrowserBarProps) => (
  <Flex gap="xs" align="center" wrap className="entry-browser__bar">
    <SearchInput size="sm" value={state.query} aria-label={searchLabel} placeholder={BROWSER_TEXT.search} onChange={(query) => patch({ query })} />
    {kinds.length > 2 && (
      <Flex gap="2xs" role="radiogroup" aria-label={BROWSER_TEXT.search}>
        {kinds.map((kind) => (
          <Tag key={kind} role="radio" selected={state.kind === kind} onSelect={() => patch({ kind })}>
            {BROWSER_TEXT.kinds[kind]}
          </Tag>
        ))}
      </Flex>
    )}
    <SegmentedControl<BrowserView> size="sm" aria-label={BROWSER_TEXT.views} value={state.view} options={VIEWS} onChange={(view) => patch({ view })} />
  </Flex>
);

export { EntryBrowserBar };
