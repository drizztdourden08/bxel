/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { PALETTE_TEXT } from '../../../editor/palette-text.constants';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import { SOURCE_TEXT } from '../../../palette-source/palette-source.constants';
import type { WizardActionsProps } from '../ImportWizard.type';

const ColorsResult = ({ wizard }: WizardActionsProps) => {
  const { colors } = wizard;
  const { mapped, plan } = colors;
  const dropped = plan?.dropped ?? 0;
  const total = (plan?.bank?.colors.length ?? 0) + dropped;
  return (
    <Stack gap="2xs" aria-live="polite">
      <Text variant="label">{IMPORT_TEXT.result}</Text>
      <Text>{PALETTE_TEXT.count(colors.limit, colors.transparent)}</Text>
      {mapped !== null && <Text variant="caption" tone="muted">{mapped.changed > 0 ? IMPORT_TEXT.changed(mapped.changed) : IMPORT_TEXT.unchanged}</Text>}
      {dropped > 0 && (
        <Text variant="caption" tone="muted">
          {SOURCE_TEXT.fits(total - dropped, total)}
        </Text>
      )}
    </Stack>
  );
};

export { ColorsResult };
