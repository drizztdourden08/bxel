/* @layer renderer-app @kind component */
import { Button, Center, EmptyState, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from './EntryBrowser.constants';
import type { EntryBrowserProps } from './EntryBrowser.type';
import { useEntryBrowser } from './behavior/useEntryBrowser';
import { EntryBrowserBar } from './sub-components/EntryBrowserBar';
import { EntryGrid } from './sub-components/EntryGrid';
import { EntryRows } from './sub-components/EntryRows';
import './EntryBrowser.css';

const ALL_KINDS = ['all', 'sprites', 'animations'] as const;

const EntryBrowser = (props: EntryBrowserProps) => {
  const { label, artwork, entries, picked, kinds = ALL_KINDS, emptyMessage, noMatchMessage, searchLabel = BROWSER_TEXT.search, footer, className, dragSource } = props;
  const model = useEntryBrowser(props);
  const { state, shown } = model;
  const body = { label, artwork, shown, picked, zoom: state.zoom, pick: model.pick, activate: model.activate, draggable: dragSource !== undefined, dragFor: model.dragFor };
  return (
    <Stack gap="xs" className={`entry-browser${className ? ` ${className}` : ''}`}>
      {entries.length > 0 && <EntryBrowserBar state={state} kinds={kinds} searchLabel={searchLabel} patch={model.patch} />}
      <div className="entry-browser__body">
        {entries.length === 0 && (
          <Center direction="column">
            <EmptyState size="sm" message={emptyMessage} />
          </Center>
        )}
        {entries.length > 0 && shown.length === 0 && (
          <Center direction="column">
            <EmptyState size="sm" message={noMatchMessage ?? BROWSER_TEXT.noMatch} />
            <Button size="xs" variant="ghost" onClick={() => model.patch({ query: '', kind: 'all' })}>
              {BROWSER_TEXT.clear}
            </Button>
          </Center>
        )}
        {shown.length > 0 && (state.view === 'grid' ? <EntryGrid {...body} /> : <EntryRows {...body} />)}
      </div>
      <Flex align="center" justify="between" gap="sm">
        <Text variant="caption" tone="dim" aria-live="polite">
          {`${BROWSER_TEXT.count(shown.length, entries.length)} ${BROWSER_TEXT.picked(picked.length)}`.trim()}
        </Text>
        {footer}
      </Flex>
    </Stack>
  );
};

export { EntryBrowser };
