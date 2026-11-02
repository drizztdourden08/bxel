/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { useGuideLines } from '../../../hooks/useGuideLines';
import { guideRows } from '../../../guides/guide-rows';
import { useGuideDialogStore } from '../../../stores/useGuideDialogStore';
import { GUIDES_TEXT } from '../ViewPanel.constants';
import { GuideRowItem } from './GuideRowItem';

const GuidesSection = () => {
  const rows = guideRows(useGuideLines());
  const show = useGuideDialogStore((state) => state.show);
  return (
    <Flex direction="column" gap="xs">
      {rows.length === 0 && <Text variant="caption" tone="muted">{GUIDES_TEXT.none}</Text>}
      {rows.map((row, index) => (
        <GuideRowItem key={`${row.axis}-${index}`} row={row} />
      ))}
      <Flex gap="xs">
        <Button size="sm" variant="secondary" onClick={() => show({ axis: 'x', from: null, position: 0 })}>{GUIDES_TEXT.addX}</Button>
        <Button size="sm" variant="secondary" onClick={() => show({ axis: 'y', from: null, position: 0 })}>{GUIDES_TEXT.addY}</Button>
      </Flex>
    </Flex>
  );
};

export { GuidesSection };
