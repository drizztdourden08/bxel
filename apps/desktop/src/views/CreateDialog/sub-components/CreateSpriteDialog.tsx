/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { FitDialog } from '../../FitDialog';
import { PlatformFindings } from '../../PlatformFindings';
import { useFileShare } from '../behavior/useFileShare';
import { useNewSprite } from '../behavior/useNewSprite';
import { CreateActions } from './CreateActions';
import { NameField } from './NameField';
import { SizeFields } from './SizeFields';

const CreateSpriteDialog = () => {
  const { form, errors, failure, valid, update, create, check } = useNewSprite();
  const share = useFileShare();
  const hide = useCreateDialogStore((state) => state.hide);
  const fields = { form, errors, update };
  return (
    <FitDialog
      open
      title={NEW_TEXT.titleSprite}
      onClose={hide}
      actions={<CreateActions label={NEW_TEXT.create} valid={valid} onCreate={create} />}
      className="create-dialog"
    >
      <Stack gap="md">
        <NameField {...fields} />
        <SizeFields {...fields} />
        {check.report !== null && <PlatformFindings report={check.report} />}
        {check.blocked !== null && <Callout tone="danger">{check.blocked}</Callout>}
        {share !== null && (
          <Stack gap="2xs">
            <Text variant="label">{NEW_TEXT.shared(share.name, share.sprites)}</Text>
            <Text>{share.count}</Text>
            <Text variant="caption" tone="muted">
              {NEW_TEXT.inherited}
            </Text>
          </Stack>
        )}
        {failure !== null && <Callout tone="danger">{failure}</Callout>}
      </Stack>
    </FitDialog>
  );
};

export { CreateSpriteDialog };
