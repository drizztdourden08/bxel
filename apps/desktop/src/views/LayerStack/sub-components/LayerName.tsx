/* @layer renderer-app @kind component */
import { useRef, useState } from 'react';
import { Field, TextInput } from '@drizztdourden08/tessera';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerNameProps } from '../LayerStack.type';

/**
 * The name of a row while it is renamed in place. Enter and leaving the field keep the name, Escape drops it.
 * A name the engine refuses shows its reason under the field and keeps the field open.
 */
const LayerName = ({ name, onRename, onDone }: LayerNameProps) => {
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const finished = useRef(false);
  const finish = (): void => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  };
  const keep = (): boolean => {
    const next = draft.trim();
    const refused = next === name ? null : onRename(next);
    setError(refused);
    if (refused === null) finish();
    return refused === null;
  };
  return (
    <Field error={error ?? undefined} width="full" size="sm" className="layer-row__field">
      <TextInput
        autoFocus
        size="sm"
        value={draft}
        invalid={error !== null}
        aria-label={LAYER_STACK_TEXT.renameLabel(name)}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
        }}
        onFocus={(event) => event.target.select()}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            keep();
          } else if (event.key === 'Escape') {
            event.stopPropagation();
            finish();
          }
        }}
        onBlur={() => {
          if (!keep()) finish();
        }}
      />
    </Field>
  );
};

export { LayerName };
