/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton } from '@drizztdourden08/tessera';
import { addTile } from '../../../tilemap/add-tile';
import { duplicateTile } from '../../../tilemap/duplicate-tile';
import { makeUnique } from '../../../tilemap/make-unique';
import { toggleEdit } from '../../../tilemap/toggle-edit';
import { ActionHint } from '../../ActionHint';
import { ADD_HINT, DELETE_HINT, DUPLICATE_HINT, EDIT_HINT, TILESET_TEXT, UNIQUE_HINT } from '../TilesetPanel.constants';
import type { TilesetActionsProps } from '../TilesetPanel.type';

const TilesetActions = ({ model, onDelete }: TilesetActionsProps) => {
  const { pickedKey } = model;
  const none = pickedKey === null;
  return (
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
      <ActionHint hint={UNIQUE_HINT}>
        <IconButton label={UNIQUE_HINT.name} size="sm" disabled={!model.selected} onClick={makeUnique}>
          <Icon name="pixel-tile-unique" />
        </IconButton>
      </ActionHint>
      <ActionHint hint={EDIT_HINT}>
        <IconButton label={EDIT_HINT.name} size="sm" active={model.editMode === 'edit'} disabled={none} onClick={toggleEdit}>
          <Icon name="pixel-pencil" />
        </IconButton>
      </ActionHint>
      <ActionHint hint={DELETE_HINT}>
        <IconButton label={DELETE_HINT.name} size="sm" disabled={none} onClick={() => pickedKey !== null && onDelete(pickedKey)}>
          <Icon name="trash-2" size={16} />
        </IconButton>
      </ActionHint>
    </ButtonGroup>
  );
};

export { TilesetActions };
