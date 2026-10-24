/* @layer renderer-app @kind component */
import { EmptyState, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import { ImagePreview } from '../../ImagePreview';
import { useSharedView } from '../../ImagePreview/behavior/useSharedView';
import type { StepProps } from '../ImportWizard.type';

const ColorsCompare = ({ image, wizard }: StepProps) => {
  const view = useSharedView();
  const { colors } = wizard;
  const mapped = colors.mapped ? { data: colors.mapped.rgba, width: image.width, height: image.height } : null;
  return (
    <Flex gap="md" align="stretch">
      <Stack gap="xs" className="import-wizard__pane">
        <Text variant="label">{IMPORT_TEXT.original(colors.count)}</Text>
        <ImagePreview image={image} label={IMPORT_TEXT.original(colors.count)} view={view} />
      </Stack>
      <Stack gap="xs" className="import-wizard__pane">
        <Text variant="label">{mapped ? IMPORT_TEXT.mapped(colors.mapped?.used ?? 0, colors.opaque) : IMPORT_TEXT.reduce}</Text>
        {mapped ? (
          <ImagePreview image={mapped} label={IMPORT_TEXT.mapped(colors.mapped?.used ?? 0, colors.opaque)} view={view} />
        ) : (
          <EmptyState message={IMPORT_TEXT.noMapping} />
        )}
      </Stack>
    </Flex>
  );
};

export { ColorsCompare };
