/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';
import { BackgroundField } from './BackgroundField';
import { BanksField } from './BanksField';
import { PaletteBlock } from './PaletteBlock';
import { PlatformField } from './PlatformField';
import { SheetFields } from './SheetFields';
import { SizeFields } from './SizeFields';

const SpriteKindFields = (props: CreateFieldsProps) => (
  <>
    <PlatformField {...props} />
    {props.form.kind === 'sprite' ? <SizeFields {...props} /> : <SheetFields {...props} />}
    {props.inDocument === true ? (
      <Text variant="caption" tone="muted">
        {NEW_TEXT.inProject}
      </Text>
    ) : (
      <>
        <BackgroundField {...props} />
        <PaletteBlock {...props} />
        <BanksField {...props} />
      </>
    )}
  </>
);

export { SpriteKindFields };
