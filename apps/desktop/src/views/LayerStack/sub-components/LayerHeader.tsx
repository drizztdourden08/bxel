/* @layer renderer-app @kind component */
import { DropdownMenu, Field, Flex, Select, Text, Tooltip } from '@drizztdourden08/tessera';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerHeaderProps } from '../LayerStack.type';
import { viewGroups } from '../behavior/view-groups';

const LayerHeader = ({ model, shown, thumbSize, onThumbSize }: LayerHeaderProps) => {
  const total = model.rows.length;
  const caption = shown < total ? LAYER_STACK_TEXT.shown(shown, total) : LAYER_STACK_TEXT.count(total);
  return (
    <>
      <Flex align="center" justify="between" gap="xs" className="layer-stack__header">
        <Tooltip content={model.ownerMeta === null ? model.owner : `${model.owner} (${model.ownerMeta})`} placement="bottom" className="layer-stack__owner">
          <Text as="span" variant="caption" tone="muted" className="layer-stack__owner-name">{model.owner}</Text>
          {model.ownerMeta !== null && <Text as="span" variant="caption" tone="faint" className="layer-stack__owner-meta">{model.ownerMeta}</Text>}
        </Tooltip>
        <Text variant="caption" tone="muted" className="layer-stack__count">{caption}</Text>
        <DropdownMenu
          trigger={{ label: LAYER_STACK_TEXT.view, icon: 'ellipsis', iconOnly: true }}
          variant="ghost"
          size="xs"
          align="end"
          groups={viewGroups(thumbSize, onThumbSize)}
        />
      </Flex>
      {model.maps.length > 1 && model.mapId !== null && (
        <Field label={LAYER_STACK_TEXT.tilemap}>
          <Select aria-label={LAYER_STACK_TEXT.tilemap} value={model.mapId} options={model.maps.map((each) => ({ ...each }))} onChange={model.onMap} />
        </Field>
      )}
    </>
  );
};

export { LayerHeader };
