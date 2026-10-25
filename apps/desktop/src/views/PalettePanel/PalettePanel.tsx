/* @layer renderer-app @kind component */
import { EmptyState, Flex, ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { PALETTE_TEXT } from '../../editor/palette-text.constants';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { usePaletteSlots } from '../../hooks/usePaletteSlots';
import { useHeldColours } from './behavior/useHeldColours';
import { useSwatchEdit } from './behavior/useSwatchEdit';
import { PALETTE_PANEL_TEXT } from './PalettePanel.constants';
import { ConfigButton } from './sub-components/ConfigButton';
import { HeldRow } from './sub-components/HeldRow';
import { SwatchEditor } from './sub-components/SwatchEditor';
import { SwatchGrid } from './sub-components/SwatchGrid';
import './PalettePanel.css';

const PalettePanel = () => {
  const target = useEditorTarget();
  const slots = usePaletteSlots();
  const held = useHeldColours();
  const editor = useSwatchEdit();
  if (!target) return <EmptyState size="sm" message={PALETTE_PANEL_TEXT.empty} />;
  const { bank } = target;
  return (
    <Stack gap="sm">
      <Flex justify="between" align="center" gap="xs">
        <Text variant="label">{PALETTE_TEXT.title(bank.name)}</Text>
        <ConfigButton />
      </Flex>
      <HeldRow slots={slots} held={held} onEdit={editor.open} />
      <ScrollArea axis="y" scrollbar="slim" fade={false} className="palette-panel__swatches">
        <Stack gap="xs">
          <SwatchGrid slots={slots} held={held} onEdit={editor.open} />
          <Text variant="caption" tone="muted">{PALETTE_TEXT.count(bank.cap, bank.transparent)}</Text>
        </Stack>
      </ScrollArea>
      <SwatchEditor editor={editor} />
    </Stack>
  );
};

export { PalettePanel };
