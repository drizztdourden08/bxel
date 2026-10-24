/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import { useChangeStore } from '../../../stores/useChangeStore';
import { LimitFields } from '../../PaletteFields';
import type { ChangeBodyProps } from '../PaletteChangeDialog.type';

const LimitBody = ({ request, state }: ChangeBodyProps) => {
  const { preview } = state;
  const setCap = useChangeStore((store) => store.setCap);
  if (!preview) return null;
  return (
    <Stack gap="md">
      <Text variant="label">{CHANGE_TEXT.shared(preview.bankName)}</Text>
      <LimitFields limit={request.cap} error={null} onChange={setCap} />
      <Stack gap="2xs" aria-live="polite">
        <Text>{`${CHANGE_TEXT.before}: ${preview.countBefore}`}</Text>
        <Text>{`${CHANGE_TEXT.after}: ${preview.countAfter}`}</Text>
        <Text variant="caption" tone="muted">
          {CHANGE_TEXT.affects(0, preview.totalSprites, 0)}
        </Text>
      </Stack>
    </Stack>
  );
};

export { LimitBody };
