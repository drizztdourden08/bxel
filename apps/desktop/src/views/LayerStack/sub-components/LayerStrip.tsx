/* @layer renderer-app @kind component */
import { Box, Flex, SegmentedControl } from '@drizztdourden08/tessera';
import type { LockKind } from '../../../editor/layer-lock.type';
import { LAYER_LOCK_ICONS, LAYER_LOCK_TEXT, LAYER_SCOPES, LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerStripProps } from '../LayerStack.type';
import { LayerColours } from './LayerColours';
import './LayerStrip.css';

/** The settings of the picked layers: lock kind, colour tag, and for an animation whether a change reaches one frame or all. */
const LayerStrip = ({ model, picked, scope, onScope }: LayerStripProps) => {
  const lead = model.rows.find((row) => row.id === (model.activeId ?? picked[0]));
  if (!lead || picked.length === 0) return null;
  const { actions } = model;
  return (
    <Box className="layer-strip" role="group" aria-label={picked.length > 1 ? LAYER_STACK_TEXT.picked(picked.length) : LAYER_STACK_TEXT.stripOf(lead.name)}>
      <Flex align="center" justify="between" gap="xs" wrap>
        <SegmentedControl<LockKind>
          aria-label={LAYER_STACK_TEXT.lockKinds}
          size="sm"
          value={lead.lock}
          options={model.locks.map((kind) => ({
            value: kind,
            icon: LAYER_LOCK_ICONS[kind],
            hint: { label: LAYER_LOCK_TEXT[kind].name, description: LAYER_LOCK_TEXT[kind].description },
          }))}
          onChange={(kind) => actions.setLock(picked, kind)}
        />
        {model.frames > 0 && (
          <SegmentedControl
            aria-label={LAYER_STACK_TEXT.scope}
            size="sm"
            value={scope}
            options={LAYER_SCOPES.map((each) => ({ value: each.value, label: each.label, title: each.title }))}
            onChange={onScope}
          />
        )}
      </Flex>
      <LayerColours value={lead.colour} label={LAYER_STACK_TEXT.tagColours} onPick={(colour) => actions.setColour(picked, colour)} />
    </Box>
  );
};

export { LayerStrip };
