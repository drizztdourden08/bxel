/* @layer renderer-app @kind component */
import { Button, Flex, NumberInput, Stack, Text } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import { useSizeDraft } from '../behavior/useSizeDraft';
import type { SizeFormProps } from '../AssetOverview.type';

const SizeForm = (props: SizeFormProps) => {
  const { fields, model } = props;
  const size = useSizeDraft(props);
  const unchanged = size.width === fields.width && size.height === fields.height;
  return (
    <Stack gap="xs" role="group" aria-label={OVERVIEW_TEXT.resize}>
      <Flex gap="sm" align="center" wrap>
        <NumberInput aria-label={fields.widthLabel} min={1} value={size.width} onChange={size.setWidth} />
        <Text tone="muted">by</Text>
        <NumberInput aria-label={fields.heightLabel} min={1} value={size.height} onChange={size.setHeight} />
        <Button size="sm" variant="secondary" disabled={!size.valid || unchanged || model.focus.readOnly} onClick={size.apply}>
          {OVERVIEW_TEXT.resize}
        </Button>
      </Flex>
      <Text variant="caption" tone="muted">
        {size.valid ? OVERVIEW_TEXT.resizeHint : OVERVIEW_TEXT.badSize}
      </Text>
    </Stack>
  );
};

export { SizeForm };
