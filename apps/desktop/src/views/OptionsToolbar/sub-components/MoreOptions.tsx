/* @layer renderer-app @kind component */
import { Button, Stack, Text } from '@drizztdourden08/tessera';
import { OptionRow } from '../../OptionControls';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';
import type { MoreOptionsProps } from '../OptionsToolbar.type';

const MoreOptions = ({ specs, onOpenPanel }: MoreOptionsProps) => (
  <Stack gap="sm" role="group" aria-label={OPTIONS_TEXT.moreTitle}>
    <Text variant="label">{OPTIONS_TEXT.moreTitle}</Text>
    {specs.map((spec) => (
      <OptionRow key={spec.id} spec={spec} compact />
    ))}
    <Button size="sm" variant="tertiary" onClick={onOpenPanel}>
      {OPTIONS_TEXT.openPanel}
    </Button>
  </Stack>
);

export { MoreOptions };
