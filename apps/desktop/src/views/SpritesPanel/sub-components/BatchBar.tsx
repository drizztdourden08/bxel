/* @layer renderer-app @kind component */
import { ActionBar, Flex, Text } from '@drizztdourden08/tessera';
import { BATCH_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { batchActions } from '../behavior/batch-actions';
import type { BatchBarProps } from '../SpritesPanel.type';
import { ActionsMenu } from './ActionsMenu';

/** Acts on two or more picked entries. A single pick uses the tile menu instead. */
const BatchBar = ({ model, groups, open }: BatchBarProps) => {
  const count = model.ids.length + model.picked.length;
  if (count < 2) return null;
  return (
    <Flex align="center" gap="sm" className="sprites-panel__batch" role="toolbar" aria-label={BATCH_TEXT.bar}>
      <Text variant="label" className="sprites-panel__batch-count" aria-live="polite">
        {BATCH_TEXT.count(count)}
      </Text>
      <ActionBar size="sm" label={BATCH_TEXT.bar} overflowLabel={BATCH_TEXT.overflow} actions={batchActions(model, open)} className="sprites-panel__batch-actions" />
      <ActionsMenu groups={groups} />
    </Flex>
  );
};

export { BatchBar };
