/* @layer renderer-app @kind component */
import { TextInput } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { usePathEdit } from '../behavior/usePathEdit';

const PathField = ({ onClose }: { readonly onClose: () => void }) => {
  const edit = usePathEdit(onClose);
  return (
    <TextInput
      autoFocus
      className="browser-crumbs__field"
      value={edit.typed}
      invalid={edit.invalid}
      aria-label={BROWSER_TEXT.editPath}
      onChange={edit.onChange}
      onKeyDown={edit.onKeyDown}
      onBlur={onClose}
    />
  );
};

export { PathField };
