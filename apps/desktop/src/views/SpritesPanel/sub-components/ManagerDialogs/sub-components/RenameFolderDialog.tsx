/* @layer renderer-app @kind component */
import { Field, Stack, TextInput } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { FOLDER_TEXT } from '../../../../../sheet-manager/folder-text.constants';
import { planRenameFolder } from '../../../../../sheet-manager/plan-rename-folder';
import { renameSprites } from '../../../../../sheet-manager/rename-sprites';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { DialogFrame } from './DialogFrame';
import { RenamePreview } from './RenamePreview';

const RenameFolderDialog = ({ model }: ManagerModelProps) => {
  const path = useManagerStore((state) => state.folderTarget) ?? '';
  const [next, setNext] = useState(path);
  const plan = useMemo(() => planRenameFolder(model.artwork, path, next), [model.artwork, path, next]);
  return (
    <DialogFrame title={FOLDER_TEXT.renameTitle(path)} canApply={plan.ok} onApply={() => renameSprites(plan, FOLDER_TEXT.renameLabel(plan.changed))}>
      <Stack gap="md">
        <Field label={FOLDER_TEXT.field} hint={FOLDER_TEXT.renameHint}>
          <TextInput autoFocus value={next} onChange={(event) => setNext(event.target.value)} />
        </Field>
        <RenamePreview plan={plan} />
      </Stack>
    </DialogFrame>
  );
};

export { RenameFolderDialog };
