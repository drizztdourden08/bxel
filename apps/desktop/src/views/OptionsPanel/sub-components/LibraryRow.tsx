/* @layer renderer-app @kind component */
import { Box, Button, Flex, Tag, Text, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { runLibraryAction } from '../../../editor/brush-library-run';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';
import type { LibraryItem, LibraryKind } from '../OptionsPanel.type';
import { LibraryPreview } from './LibraryPreview';

const LibraryRow = ({ kind, item, active }: { kind: LibraryKind; item: LibraryItem; active: boolean }) => {
  const [name, setName] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const commit = (): void => {
    const trimmed = name?.trim() ?? '';
    if (trimmed !== '' && trimmed !== item.name) runLibraryAction({ kind, action: 'rename', id: item.id, name: trimmed });
    setName(null);
  };
  const use = (): void => useDrawingStore.getState().patch(kind === 'brush' ? { brushId: item.id } : { patternId: item.id });
  const remove = (): void => (confirm ? void runLibraryAction({ kind, action: 'remove', id: item.id }) : setConfirm(true));
  return (
    <Box as="li" className="preset-row" data-active={active}>
      <LibraryPreview item={item} />
      <Box className="options-library__body">
        {name === null ? (
          <Text variant="label">{item.name}</Text>
        ) : (
          <TextInput size="sm" value={name} aria-label={OPTIONS_PANEL_TEXT.library.nameField} autoFocus onChange={(event) => setName(event.target.value)} onEnter={commit} onBlur={commit} />
        )}
        <Text variant="caption" tone="muted">
          {OPTIONS_PANEL_TEXT.library.size(item.width, item.height)}
        </Text>
        <Flex align="center" gap="xs" wrap>
          {active ? (
            <Tag color="primary">{OPTIONS_PANEL_TEXT.library.inUse}</Tag>
          ) : (
            <Button size="xs" variant="secondary" onClick={use}>
              {OPTIONS_PANEL_TEXT.library.use}
            </Button>
          )}
          <Button size="xs" variant="tertiary" onClick={() => setName(item.name)}>
            {OPTIONS_PANEL_TEXT.library.rename}
          </Button>
          <Button size="xs" variant="tertiary" onClick={remove} onBlur={() => setConfirm(false)}>
            {confirm ? OPTIONS_PANEL_TEXT.library.confirmRemove : OPTIONS_PANEL_TEXT.library.remove}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export { LibraryRow };
