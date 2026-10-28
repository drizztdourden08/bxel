/* @layer renderer-app @kind component */
import { ColorSwatch, Field, Flex } from '@drizztdourden08/tessera';
import { BUILDER_TEXT } from '../RampBuilderDialog.constants';
import type { BuilderPartProps } from '../RampBuilderDialog.type';

const BasePicker = ({ state }: BuilderPartProps) => (
  <Field label={BUILDER_TEXT.base}>
    <Flex gap="2xs" wrap role="radiogroup" aria-label={BUILDER_TEXT.base} className="ramp-builder__bases">
      {state.bank.slots.map((slot, index) =>
        slot.kind === 'color' ? (
          <ColorSwatch
            key={slot.id}
            size="sm"
            role="radio"
            aria-checked={state.settings.baseIndex === index}
            aria-label={BUILDER_TEXT.baseSwatch(index, slot.rgb.toUpperCase())}
            selected={state.settings.baseIndex === index}
            color={slot.rgb}
            onClick={() => state.change({ baseIndex: index })}
          />
        ) : null,
      )}
    </Flex>
  </Field>
);

export { BasePicker };
