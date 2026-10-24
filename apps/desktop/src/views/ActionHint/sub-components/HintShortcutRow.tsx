/* @layer renderer-app @kind component */
import { Flex, Shortcut, Text } from '@drizztdourden08/tessera';
import { Fragment } from 'react';
import { ACTION_HINT_TEXT } from '../ActionHint.constants';
import type { HintShortcutRowProps } from '../ActionHint.type';
import { shortcutCombos } from '../behavior/shortcut-combos';

const HintShortcutRow = ({ shortcut }: HintShortcutRowProps) => {
  const combos = shortcutCombos(shortcut);
  const note = shortcut.command === undefined && shortcut.keys === undefined && shortcut.mouse === undefined;
  if (combos.length === 0 && !note) return null;
  return (
    <Flex gap="xs" align="center" wrap>
      {shortcut.label !== undefined && <Text as="span" variant="caption" tone="muted">{shortcut.label}</Text>}
      {combos.map((combo, index) => (
        <Fragment key={index}>
          {index > 0 && <Text as="span" variant="caption" tone="muted">{ACTION_HINT_TEXT.or}</Text>}
          <Shortcut size="xs" keys={combo.keys} mouse={combo.mouse} />
        </Fragment>
      ))}
    </Flex>
  );
};

export { HintShortcutRow };
