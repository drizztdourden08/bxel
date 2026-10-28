/* @layer renderer-app @kind component */
import { Icon, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';

const UsedByMark = ({ users }: { readonly users: number }) => (
  <>
    <Icon name="link" size={12} aria-hidden />
    <Text as="span" variant="caption" tone="muted" title={BROWSER_TEXT.usedBy(users)} aria-label={BROWSER_TEXT.usedBy(users)}>
      {users}
    </Text>
  </>
);

export { UsedByMark };
