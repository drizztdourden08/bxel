/* @layer renderer-app @kind component */
import { Box, DropdownMenu, Flex, InlineEdit, Text } from '@drizztdourden08/tessera';
import { useRef, useState } from 'react';
import { editRamp } from '../../../palette-ramps/edit-ramp';
import { SphereTest } from '../../SphereTest';
import { dropMembership } from '../behavior/drop-membership';
import { rampRowGroups } from '../behavior/ramp-row-groups';
import { reportOutcome } from '../behavior/report-outcome';
import { PALETTE_PANEL_TEXT, RAMP_ROW_TEXT } from '../PalettePanel.constants';
import type { RampRowProps } from '../PalettePanel.type';
import { RampSwatch } from './RampSwatch';

const RampRow = ({ panel, ramp, indices }: RampRowProps) => {
  const [over, setOver] = useState(false);
  const nameRef = useRef<HTMLElement>(null);
  const colours = indices.map((index) => panel.slots[index]?.hex ?? '');
  const name = ramp?.name ?? PALETTE_PANEL_TEXT.notInRamp;
  const rename = () => nameRef.current?.querySelector<HTMLElement>('button')?.click();
  return (
    <Box
      surface="raised"
      className={over ? 'ramp-row ramp-row--over' : 'ramp-row'}
      role="group"
      aria-label={name}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        setOver(false);
        dropMembership(panel, ramp?.id ?? null, event);
      }}
    >
      <Flex align="center" gap="xs" className="ramp-row__head">
        {ramp && <SphereTest size="sm" colours={colours} label={RAMP_ROW_TEXT.sphere(ramp.name)} />}
        <Box ref={nameRef} className="ramp-row__name">
          {ramp && !panel.lock.locked ? (
            <InlineEdit size="sm" label={RAMP_ROW_TEXT.name(ramp.name)} value={ramp.name} onCommit={(next) => reportOutcome(editRamp(panel.target, ramp.id, { name: next }))} />
          ) : (
            <Text variant="label" tone={ramp ? undefined : 'muted'}>{name}</Text>
          )}
        </Box>
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
      <Flex gap="2xs" wrap className="ramp-row__swatches">
        {indices.map((index) => (
          <RampSwatch key={index} panel={panel} index={index} from={ramp?.id ?? null} />
        ))}
      </Flex>
    </Box>
  );
};

export { RampRow };
