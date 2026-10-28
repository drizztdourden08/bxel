/* @layer renderer-app @kind component */
import { Flex, Stack, Text } from '@drizztdourden08/tessera';
import { ALL_KINDS, BROWSER_TEXT } from './EntryBrowser.constants';
import type { EntryBrowserProps } from './EntryBrowser.type';
import { useEntryBrowser } from './behavior/useEntryBrowser';
import { EntryBrowserBar } from './sub-components/EntryBrowserBar';
import { EntryBrowserContent } from './sub-components/EntryBrowserContent';
import './EntryBrowser.css';

const EntryBrowser = (props: EntryBrowserProps) => {
  const { label, artwork, entries, picked, kinds = ALL_KINDS, emptyMessage, noMatchMessage, searchLabel = BROWSER_TEXT.search, footer, className, dragSource } = props;
  const model = useEntryBrowser(props);
  const { state, shown } = model;
  const body = { label, artwork, shown, picked, zoom: state.zoom, pick: model.pick, activate: model.activate, draggable: dragSource !== undefined, dragFor: model.dragFor };
  return (
    <Stack gap="xs" className={`entry-browser${className ? ` ${className}` : ''}`}>
      {entries.length > 0 && <EntryBrowserBar state={state} kinds={kinds} searchLabel={searchLabel} patch={model.patch} />}
      <EntryBrowserContent
        total={entries.length}
        view={state.view}
        body={body}
        emptyMessage={emptyMessage}
        noMatchMessage={noMatchMessage}
        onClear={() => model.patch({ query: '', kind: 'all' })}
      />
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
