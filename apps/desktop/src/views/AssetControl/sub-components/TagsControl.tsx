/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { useTagsControl } from '../behavior/useTagsControl';
import { ASSET_CONTROL_TEXT } from '../AssetControl.constants';
import { TagRow } from './TagRow';

const TagsControl = () => {
  const model = useTagsControl();
  if (model === null) return null;
  return (
    <Stack gap="sm">
      {model.rows.length === 0 && <Text tone="muted">{ASSET_CONTROL_TEXT.noTags}</Text>}
      {model.rows.map((row) => (
        <TagRow key={row.id} row={row} readOnly={model.readOnly} edit={model.edit} />
      ))}
      {model.mirrors > 0 && <Text tone="muted">{ASSET_CONTROL_TEXT.mirrors(model.mirrors)}</Text>}
      {model.problem !== null && <Callout tone="danger">{model.problem}</Callout>}
    </Stack>
  );
};

export { TagsControl };
