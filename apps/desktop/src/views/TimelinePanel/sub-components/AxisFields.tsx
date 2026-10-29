/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { AxisFieldsProps } from '../TimelinePanel.type';
import { NumberField } from './NumberField';

const AxisFields = ({ caption, frameId, x, y, min, max, step, disabled }: AxisFieldsProps) => (
  <Flex gap="xs" align="center">
    <Text variant="caption" tone="muted">{caption}</Text>
    {[x, y].map((axis) => (
      <NumberField key={`${frameId}:${axis.label}:${axis.value}`} label={axis.label} value={axis.value} min={min} max={max} step={step} disabled={disabled} mixed={axis.mixed} onCommit={axis.onCommit} />
    ))}
    <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.pixelUnit}</Text>
  </Flex>
);

export { AxisFields };
