/* @layer renderer-app @kind component */
import { Box, Button, Icon, Text } from '@drizztdourden08/tessera';
import { brushFromSelection } from '../../../editor/brush-from-selection';
import { patternFromSelection } from '../../../editor/pattern-from-selection';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';
import type { LibraryItem, LibraryKind } from '../OptionsPanel.type';
import { LibraryRow } from './LibraryRow';

const LibrarySection = ({ kind, items, activeId }: { kind: LibraryKind; items: readonly LibraryItem[]; activeId: string | null }) => {
  const text = OPTIONS_PANEL_TEXT.library[kind];
  const make = kind === 'brush' ? brushFromSelection : patternFromSelection;
  return (
    <Box as="section" className="options-library" aria-label={text.heading}>
      <Text variant="overline" tone="muted" className="options-panel__heading">
        {text.heading}
      </Text>
      {items.length === 0 && (
        <Text variant="caption" tone="muted">
          {text.empty}
        </Text>
      )}
      <Box as="ul" className="options-library__rows" role="list">
        {items.map((item) => (
          <LibraryRow key={item.id} kind={kind} item={item} active={item.id === activeId} />
        ))}
      </Box>
      <Button size="sm" variant="secondary" icon={<Icon name="plus" />} onClick={() => void make()}>
        {text.make}
      </Button>
    </Box>
  );
};

export { LibrarySection };
