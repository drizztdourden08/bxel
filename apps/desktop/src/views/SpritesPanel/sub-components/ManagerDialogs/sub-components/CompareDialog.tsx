/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, Flex, Stack } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { compareSprites } from '../../../../../sheet-manager/compare-sprites';
import { IDENTICAL_TEXT } from '../../../../../sheet-manager/identical-text.constants';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useTargets } from '../behavior/useTargets';
import { CompareDiff } from './CompareDiff';
import { CompareSide } from './CompareSide';
import { CompareVerdict } from './CompareVerdict';

const CompareDialog = ({ model }: ManagerModelProps) => {
  const patch = useManagerStore((state) => state.patch);
  const [first, second, ...rest] = useTargets(model);
  const comparison = useMemo(() => (first && second ? compareSprites(model.artwork, first, second) : null), [model.artwork, first, second]);
  const close = (): void => patch({ dialog: null });
  const ready = first && second && rest.length === 0 && comparison;
  return (
    <DialogShell
      open
      title={IDENTICAL_TEXT.compareTitle}
      onClose={close}
      actions={
        <Button variant="primary" onClick={close}>
          {IDENTICAL_TEXT.close}
        </Button>
      }
    >
      {ready ? (
        <Stack gap="md">
          <Flex gap="md" justify="center" wrap>
            <CompareSide artwork={model.artwork} sprite={first} />
            <CompareSide artwork={model.artwork} sprite={second} />
            <CompareDiff artwork={model.artwork} first={first} second={second} />
          </Flex>
          <CompareVerdict comparison={comparison} first={first} second={second} />
        </Stack>
      ) : (
        <Callout tone="warning">{IDENTICAL_TEXT.compareNeedTwo}</Callout>
      )}
    </DialogShell>
  );
};

export { CompareDialog };
