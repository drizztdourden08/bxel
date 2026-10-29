/* @layer renderer-app @kind component */
import { Checkbox, Flex, Icon, IconButton, Pressable, Select, Text } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { removeShape } from '../behavior/remove-shape';
import { replaceShape } from '../behavior/replace-shape';
import { SHAPE_KIND_TEXT, TILESET_TEXT } from '../TilesetPanel.constants';
import type { ShapeRowProps } from '../TilesetPanel.type';

const ShapeRow = ({ tile, shape, index, selected, layers }: ShapeRowProps) => {
  const setIndex = useTilesetViewStore((state) => state.setShapeIndex);
  return (
    <Flex gap="xs" align="center" className="tileset-panel__shape-row" data-selected={selected ? '' : undefined}>
      <Pressable type="button" className="tileset-panel__shape-pick" aria-pressed={selected} aria-label={TILESET_TEXT.pickShape(index + 1, SHAPE_KIND_TEXT[shape.kind])} onClick={() => setIndex(index)}>
        <Text variant="caption">{SHAPE_KIND_TEXT[shape.kind]}</Text>
      </Pressable>
      <Select
        size="sm"
        aria-label={TILESET_TEXT.shapeLayer(index + 1)}
        options={layers.map((layer) => ({ value: layer, label: layer }))}
        value={shape.layer}
        onChange={(layer) => replaceShape(tile, index, { ...shape, layer })}
      />
      <Checkbox
        checked={shape.oneWay === true}
        ariaLabel={TILESET_TEXT.oneWay(index + 1)}
        label={TILESET_TEXT.oneWayShort}
        onChange={(oneWay) => replaceShape(tile, index, oneWay ? { ...shape, oneWay } : { ...shape, oneWay: undefined })}
      />
      <IconButton label={TILESET_TEXT.deleteShape(index + 1)} size="sm" onClick={() => removeShape(tile, index)}>
        <Icon name="trash-2" size={16} />
      </IconButton>
    </Flex>
  );
};

export { ShapeRow };
