/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Box, Button, Flex, Slider, Toggle } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerViewControlsProps } from '../LayerStack.type';

const LayerViewControls = ({ model, picked, lead, mixed }: LayerViewControlsProps) => {
  const [draft, setDraft] = useState<number | null>(null);
  const { actions } = model;
  const sprite = model.kind === 'sprite';
  const commit = (): void => {
    if (draft !== null && (draft !== lead.viewOpacity || mixed.opacity)) actions.setView(picked, { viewOpacity: draft });
    setDraft(null);
  };
  return (
    <Flex align="center" gap="sm" wrap className="layer-strip__view">
      <Box className="layer-strip__opacity" onPointerUp={commit} onKeyUp={commit} onBlur={commit}>
        <Slider
          aria-label={LAYER_STACK_TEXT.opacity}
          size="sm"
          min={0}
          max={100}
          step={1}
          input
          mixed={mixed.opacity && draft === null}
          value={draft ?? lead.viewOpacity}
          formatValue={LAYER_STACK_TEXT.opacityValue}
          onChange={setDraft}
        />
      </Box>
      {sprite && lead.kind === 'pixel' && (
        <ActionHint hint={{ name: LAYER_STACK_TEXT.clipLabel, description: LAYER_STACK_TEXT.clipHint }}>
          <Toggle size="sm" label={LAYER_STACK_TEXT.clipLabel} checked={lead.clip} mixed={mixed.clip} onChange={(clip) => actions.setView(picked, { clip })} />
        </ActionHint>
      )}
      {sprite && lead.kind !== 'reference' && (
        <ActionHint hint={{ name: LAYER_STACK_TEXT.exportLabel, description: LAYER_STACK_TEXT.exportHint }}>
          <Toggle size="sm" label={LAYER_STACK_TEXT.exportLabel} checked={lead.exported} mixed={mixed.exported} onChange={(exported) => actions.setView(picked, { exported })} />
        </ActionHint>
      )}
      {sprite && lead.kind === 'reference' && lead.missing && (
        <Button size="sm" variant="secondary" onClick={() => actions.relink(lead.id)}>
          {LAYER_STACK_TEXT.relink}
        </Button>
      )}
    </Flex>
  );
};

export { LayerViewControls };
