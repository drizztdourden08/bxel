/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import { useSourceValue } from '../../../config-source/useSourceValue';
import { isSaved } from '../../../project-config/is-saved';
import { NO_COVER, PROJECT_CONFIG_TEXT } from '../../../project-config/project-config.constants';
import { PROJECT_SOURCE } from '../../../project-config/project-source.constants';
import { useProjectFocus } from '../../../project-config/useProjectFocus';

const CoverControl = () => {
  const focus = useProjectFocus();
  const value = useSourceValue(PROJECT_SOURCE, 'project.cover');
  const sprites = (focus?.artwork?.sprites ?? []).filter((sprite) => sprite.role === 'sprite' && focus?.paths.has(sprite.id) && isSaved(focus.documentId, sprite.id));
  const options = [{ value: NO_COVER, label: PROJECT_CONFIG_TEXT.noCover }, ...sprites.map((sprite) => ({ value: sprite.id, label: sprite.name }))];
  return (
    <Select
      options={options}
      value={typeof value === 'string' && value !== '' ? value : NO_COVER}
      onChange={(next) => void PROJECT_SOURCE.set('project.cover', next === NO_COVER ? '' : next)}
      aria-label={PROJECT_CONFIG_TEXT.coverLabel}
    />
  );
};

export { CoverControl };
