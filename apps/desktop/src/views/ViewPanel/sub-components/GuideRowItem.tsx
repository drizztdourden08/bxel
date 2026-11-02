/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, NumberInput, Text } from '@drizztdourden08/tessera';
import { applyGuide } from '../../../guides/apply-guide';
import { guideLimit } from '../../../guides/guide-limit';
import { removeGuide } from '../../../guides/remove-guide';
import { GUIDES_TEXT } from '../ViewPanel.constants';
import type { GuideRowProps } from '../ViewPanel.type';

const GuideRowItem = ({ row }: GuideRowProps) => {
  const name = GUIDES_TEXT[row.axis];
  return (
    <Flex gap="xs" align="center" className="view-panel__row">
      <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{name}</Text>
      <NumberInput
        size="sm"
        aria-label={GUIDES_TEXT.position(name)}
        min={0}
        max={guideLimit(row.axis)}
        step={0.5}
        value={row.position}
        onChange={(to) => applyGuide({ axis: row.axis, from: row.position, to })}
      />
      <IconButton label={GUIDES_TEXT.remove(name)} size="sm" variant="tertiary" onClick={() => removeGuide(row)}>
        <Icon name="x" size={14} />
      </IconButton>
    </Flex>
  );
};

export { GuideRowItem };
