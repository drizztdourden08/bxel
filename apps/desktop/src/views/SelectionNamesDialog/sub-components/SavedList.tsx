/* @layer renderer-app @kind component */
import { Flex, Stack, Text } from '@drizztdourden08/tessera';
import { MODE_LABELS } from '../../../editor/selection/selection.constants';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { SELECTION_NAMES_TEXT } from '../SelectionNamesDialog.constants';
import { SavedRow } from './SavedRow';

const SavedList = () => {
  const target = useEditorTarget();
  const saved = target?.sprite.selections ?? [];
  if (!target || saved.length === 0) return <Text tone="dim">{SELECTION_NAMES_TEXT.empty}</Text>;
  return (
    <Stack gap="xs" role="list" aria-label={SELECTION_NAMES_TEXT.list}>
      {saved.map((each) => (
        <Flex key={each.name} role="listitem" gap="sm" align="center" wrap>
          <SavedRow selection={each} stale={each.width !== target.sprite.width || each.height !== target.sprite.height} modeLabels={MODE_LABELS} />
        </Flex>
      ))}
    </Stack>
  );
};

export { SavedList };
