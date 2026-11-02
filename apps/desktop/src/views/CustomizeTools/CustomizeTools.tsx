/* @layer renderer-app @kind component */
import { Button, DialogShell, ScrollArea, Stack } from '@drizztdourden08/tessera';
import { useCustomizeStore } from '../../stores/useCustomizeStore';
import { useCatalogueSurface } from '../../hooks/useCatalogueSurface';
import { resetSurfaceTools } from '../../editor/tool-catalogue/reset-surface-tools';
import { CUSTOMIZE_TEXT } from './CustomizeTools.constants';
import { KeysSection } from './sub-components/KeysSection';
import { RailSection } from './sub-components/RailSection';

const CustomizeTools = () => {
  const open = useCustomizeStore((state) => state.open);
  const show = useCustomizeStore((state) => state.show);
  const surface = useCatalogueSurface();
  if (!open) return null;
  const actions = (
    <>
      <Button variant="tertiary" onClick={() => resetSurfaceTools(surface)}>
        {CUSTOMIZE_TEXT.reset}
      </Button>
      <Button variant="primary" onClick={() => show(false)}>
        {CUSTOMIZE_TEXT.done}
      </Button>
    </>
  );
  return (
    <DialogShell open title={CUSTOMIZE_TEXT.title} onClose={() => show(false)} actions={actions}>
      <ScrollArea axis="y" scrollbar="slim" aria-label={CUSTOMIZE_TEXT.title}>
        <Stack gap="lg">
          <RailSection />
          <KeysSection />
        </Stack>
      </ScrollArea>
    </DialogShell>
  );
};

export { CustomizeTools };
