/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { MANY_TEXT } from './ManyProperties.constants';
import { useManyProperties } from './behavior/useManyProperties';
import { ManyKinds } from './sub-components/ManyKinds';
import { ManyNames } from './sub-components/ManyNames';
import { ManyTags } from './sub-components/ManyTags';

const ManyProperties = () => {
  const model = useManyProperties();
  if (model === null) return null;
  return (
    <Stack gap="md" className="many-properties">
      <Text as="h2" variant="subtitle">
        {MANY_TEXT.title(model.items.length)}
      </Text>
      <ManyKinds items={model.items} />
      <ManyTags model={model} />
      <ManyNames items={model.items} />
    </Stack>
  );
};

export { ManyProperties };
