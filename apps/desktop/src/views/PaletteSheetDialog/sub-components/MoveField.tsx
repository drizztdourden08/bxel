/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { RECOLOUR_TEXT } from '../../../palette-panel/palette-panel.constants';
import { usePaletteSheetStore } from '../../../stores/usePaletteSheetStore';
import type { MoveFieldProps } from '../PaletteSheetDialog.type';

/** The swatch a colour moves to, changed in the request so the preview follows. */
const MoveField = ({ request, count }: MoveFieldProps) => (
  <Field label={RECOLOUR_TEXT.destination}>
    <TextInput
      size="sm"
      inputMode="numeric"
      value={String(request.last)}
      aria-label={RECOLOUR_TEXT.destination}
      onChange={(event) => {
        const next = Math.round(Number(event.target.value));
        if (Number.isFinite(next) && next >= 0 && next < count) usePaletteSheetStore.getState().open({ ...request, last: next });
      }}
    />
  </Field>
);

export { MoveField };
