/* @layer renderer-app @kind component */
import { Flex, Icon } from '@drizztdourden08/tessera';
import { ALGORITHM_ICONS } from '../TransformBar.constants';

const MethodOption = ({ value, label }: { value: string; label: string }) => {
  const icon = ALGORITHM_ICONS[value];
  return (
    <Flex gap="xs" align="center">
      {icon && <Icon name={icon} />}
      {label}
    </Flex>
  );
};

export { MethodOption };
