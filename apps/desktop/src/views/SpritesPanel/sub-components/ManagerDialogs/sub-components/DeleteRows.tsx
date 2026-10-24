/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { DELETE_TEXT } from '../../../../../sheet-manager/delete-text.constants';
import { PREVIEW_ROWS } from '../ManagerDialogs.constants';
import type { DeleteRowsProps } from '../ManagerDialogs.type';

const DeleteRows = ({ impacts }: DeleteRowsProps) => (
  <Stack gap="2xs" role="list">
    {impacts.slice(0, PREVIEW_ROWS).map((impact) => (
      <Text key={impact.id} variant="caption" role="listitem">
        {`${impact.name}: ${impact.sheets + impact.tilemaps === 0 ? DELETE_TEXT.unused : DELETE_TEXT.use(impact.sheets, impact.tilemaps)}`}
      </Text>
    ))}
    {impacts.length > PREVIEW_ROWS && (
      <Text variant="caption" tone="dim">{`+ ${impacts.length - PREVIEW_ROWS}`}</Text>
    )}
  </Stack>
);

export { DeleteRows };
