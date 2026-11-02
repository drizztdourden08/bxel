/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, NumberInput, SegmentedControl, Slider, Text, Toggle } from '@drizztdourden08/tessera';
import type { ReferenceChange } from '../../../asset-view/reference-image.type';
import { REFERENCE_LIMITS, REFERENCE_TEXT } from '../../../reference-image/reference-image.constants';
import { removeReferenceImage } from '../../../reference-image/remove-reference-image';
import { updateReferenceImage } from '../../../reference-image/update-reference-image';
import type { ReferenceRowProps } from '../ViewPanel.type';
import { PLACES } from './ReferenceRow.constants';

const ReferenceRow = ({ image }: ReferenceRowProps) => {
  const change = (fields: ReferenceChange): void => {
    updateReferenceImage(image.id, fields);
  };
  return (
    <Flex direction="column" gap="xs" className="view-panel__row">
      <Flex gap="xs" align="center">
        <Text as="span" variant="caption" className="view-panel__field-label">{image.name}</Text>
        <IconButton label={REFERENCE_TEXT.remove(image.name)} size="sm" variant="tertiary" onClick={() => removeReferenceImage(image.id)}>
          <Icon name="x" size={14} />
        </IconButton>
      </Flex>
      <Flex gap="xs" align="center">
        <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{REFERENCE_TEXT.x}</Text>
        <NumberInput size="sm" aria-label={REFERENCE_TEXT.position(image.name, REFERENCE_TEXT.x)} disabled={image.locked} value={image.x} onChange={(x) => change({ x })} />
        <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{REFERENCE_TEXT.y}</Text>
        <NumberInput size="sm" aria-label={REFERENCE_TEXT.position(image.name, REFERENCE_TEXT.y)} disabled={image.locked} value={image.y} onChange={(y) => change({ y })} />
      </Flex>
      <Flex gap="xs" align="center">
        <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{REFERENCE_TEXT.scale}</Text>
        <NumberInput size="sm" aria-label={REFERENCE_TEXT.scaleOf(image.name)} min={REFERENCE_LIMITS.scale.min} max={REFERENCE_LIMITS.scale.max} disabled={image.locked} value={image.scale} onChange={(scale) => change({ scale })} />
      </Flex>
      <Slider
        size="sm"
        label={REFERENCE_TEXT.opacityOf(image.name)}
        min={REFERENCE_LIMITS.opacity.min}
        max={REFERENCE_LIMITS.opacity.max}
        step={1}
        keyStep={5}
        formatValue={(value) => `${value}%`}
        value={image.opacity}
        onChange={(opacity) => change({ opacity })}
      />
      <SegmentedControl
        size="sm"
        label={REFERENCE_TEXT.placeOf(image.name)}
        value={image.above ? 'above' : 'below'}
        options={PLACES.map((each) => ({ value: each.value, label: each.label }))}
        onChange={(value) => change({ above: value === 'above' })}
      />
      <Toggle size="sm" label={REFERENCE_TEXT.lock} checked={image.locked} onChange={(locked) => change({ locked })} />
    </Flex>
  );
};

export { ReferenceRow };
