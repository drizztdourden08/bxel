/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import { useNameDraft } from '../behavior/useNameDraft';
import type { OverviewPartProps } from '../AssetOverview.type';

const NameField = ({ model }: OverviewPartProps) => {
  const name = useNameDraft(model.name, model.rename);
  return (
    <Field label={OVERVIEW_TEXT.nameLabel} error={name.error ?? undefined}>
      <TextInput
        value={name.draft}
        invalid={name.error !== null}
        disabled={model.focus.readOnly}
        onChange={(event) => name.setDraft(event.target.value)}
        onBlur={(event) => name.commit(event.target.value)}
        onEnter={name.commit}
      />
    </Field>
  );
};

export { NameField };
