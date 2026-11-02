/* @layer renderer-app @kind component */
import { ColorSwatch, Field, Flex, ScrollArea } from '@drizztdourden08/tessera';
import { BUILDER_TEXT } from '../RampBuilderDialog.constants';
import type { BuilderPartProps } from '../RampBuilderDialog.type';

const BasePicker = ({ state }: BuilderPartProps) => (
  <Field label={BUILDER_TEXT.base}>
    <ScrollArea axis="y" scrollbar="slim" fade={false} className="ramp-builder__bases">
      <Flex gap="2xs" wrap role="radiogroup" aria-label={BUILDER_TEXT.base}>
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
    </ScrollArea>
  </Field>
);

export { BasePicker };
