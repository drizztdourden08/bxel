/* @layer renderer-app @kind component */
import { Callout, Select, Stack } from '@drizztdourden08/tessera';
import { PLATFORM_TEXT } from '../../../platform-preset/platform-preset.constants';
import { usePlatformControl } from '../behavior/usePlatformControl';

const PlatformControl = () => {
  const model = usePlatformControl();
  if (model === null) return null;
  return (
    <Stack gap="xs">
      <Select searchable groups={model.groups} value={model.value} onChange={model.choose} aria-label={PLATFORM_TEXT.label} />
      {model.unknown !== null && (
        <Callout variant="footnote" tone="warning">
          {model.unknown}
        </Callout>
      )}
    </Stack>
  );
};

export { PlatformControl };
