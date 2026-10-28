/* @layer renderer-app @kind component */
import { ButtonGroup, Flex, Icon, IconButton, NumberInput, Text } from '@drizztdourden08/tessera';
import { MAX_LAYOUT_COLUMNS } from '@bxel/document';
import { addTile } from '../../../tilemap/add-tile';
import { askDeleteTile } from '../../../tilemap/ask-delete-tile';
import { duplicateTile } from '../../../tilemap/duplicate-tile';
import { setLayout } from '../../../tilemap/set-layout';
import { toggleEdit } from '../../../tilemap/toggle-edit';
import { ActionHint } from '../../ActionHint';
import { ADD_HINT, DELETE_HINT, DUPLICATE_HINT, EDIT_HINT, TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const TilesetActions = ({ model }: TilesetModelProps) => {
  const { pickedKey } = model;
  const none = pickedKey === null;
  return (
    <Flex gap="sm" align="center" justify="between" wrap>
      <ButtonGroup aria-label={TILESET_TEXT.actions}>
        <ActionHint hint={ADD_HINT}>
          <IconButton label={ADD_HINT.name} size="sm" onClick={addTile}>
            <Icon name="pixel-tile-add" />
          </IconButton>
        </ActionHint>
        <ActionHint hint={DUPLICATE_HINT}>
          <IconButton label={DUPLICATE_HINT.name} size="sm" disabled={none} onClick={() => pickedKey !== null && duplicateTile(pickedKey)}>
            <Icon name="copy" size={16} />
          </IconButton>
        </ActionHint>
        <ActionHint hint={EDIT_HINT}>
          <IconButton label={EDIT_HINT.name} size="sm" active={model.editMode === 'edit'} disabled={none} onClick={toggleEdit}>
            <Icon name="pixel-pencil" />
          </IconButton>
        </ActionHint>
        <ActionHint hint={DELETE_HINT}>
          <IconButton label={DELETE_HINT.name} size="sm" disabled={none} onClick={() => pickedKey !== null && askDeleteTile(pickedKey)}>
            <Icon name="trash-2" size={16} />
          </IconButton>
        </ActionHint>
      </ButtonGroup>
      <Flex gap="xs" align="center">
        <Text variant="caption" tone="muted" aria-hidden="true">
          {TILESET_TEXT.columns}
        </Text>
        <NumberInput
          aria-label={TILESET_TEXT.columns}
          size="sm"
          min={1}
          max={MAX_LAYOUT_COLUMNS}
          value={model.layout.columns}
          onChange={(columns) => columns >= 1 && columns <= MAX_LAYOUT_COLUMNS && setLayout({ columns })}
        />
      </Flex>
    </Flex>
  );
};

export { TilesetActions };
