/* @layer renderer-app @kind component */
import { DropdownMenu, Flex, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { SphereTest } from '../../SphereTest';
import { rampRowGroups } from '../behavior/ramp-row-groups';
import { PALETTE_PANEL_TEXT, RAMP_ROW_TEXT } from '../PalettePanel.constants';
import type { RampRowProps } from '../PalettePanel.type';
import { RampGrip } from './RampGrip';
import { RampRowName } from './RampRowName';

const RampRowHead = ({ panel, ramp, indices, reorder, position = 0 }: RampRowProps) => {
  const nameRef = useRef<HTMLElement>(null);
  const colours = indices.map((index) => panel.slots[index]?.hex ?? '');
  const rename = () => nameRef.current?.querySelector<HTMLElement>('button')?.click();
  return (
    <Flex align="center" gap="xs" className="ramp-row__head">
      {ramp && reorder && !panel.lock.locked && <RampGrip reorder={reorder} position={position} ramp={ramp} />}
      {ramp && <SphereTest size="sm" colours={colours} label={RAMP_ROW_TEXT.sphere(ramp.name)} />}
      <RampRowName panel={panel} ramp={ramp} nameRef={nameRef} />
      <Text variant="caption" tone="muted">{RAMP_ROW_TEXT.steps(indices.length)}</Text>
      {ramp && (
        <DropdownMenu
          size="xs"
          variant="tertiary"
          label={PALETTE_PANEL_TEXT.rampActions(ramp.name)}
          trigger={{ label: PALETTE_PANEL_TEXT.rampActions(ramp.name), icon: 'ellipsis-vertical', iconOnly: true }}
          groups={rampRowGroups(panel, ramp, rename)}
        />
      )}
    </Flex>
  );
};

export { RampRowHead };
