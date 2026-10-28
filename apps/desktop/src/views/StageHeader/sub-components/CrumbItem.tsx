/* @layer renderer-app @kind component */
import { Button, DropdownMenu, Flex, Icon, Text } from '@drizztdourden08/tessera';
import type { CrumbItemProps } from '../StageHeader.type';

const labelOf = (label: string, note: string | undefined): string => (note === undefined ? label : `${label} (${note})`);

const CrumbItem = ({ crumb, last }: CrumbItemProps) => {
  const label = labelOf(crumb.label, crumb.note);
  const icon = crumb.icon ? <Icon name={crumb.icon} size={14} /> : undefined;
  if (crumb.menu) return <DropdownMenu size="xs" label={label} groups={crumb.menu} trigger={{ label, icon: crumb.icon }} />;
  if (crumb.run) {
    return (
      <Button size="xs" variant="ghost" icon={icon} title={crumb.title} onClick={crumb.run}>
        {label}
      </Button>
    );
  }
  return (
    <Flex as="span" gap="xs" align="center" className="stage-header__crumb" aria-current={last ? 'location' : undefined}>
      {icon}
      <Text as="span" variant="label">{label}</Text>
    </Flex>
  );
};

export { CrumbItem };
