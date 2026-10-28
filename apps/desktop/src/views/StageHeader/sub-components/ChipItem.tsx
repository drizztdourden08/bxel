/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Tag } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';
import type { ChipItemProps } from '../StageHeader.type';

const ChipItem = ({ chip }: ChipItemProps) => {
  const body: ReactNode = (
    <>
      {chip.icon && <Icon name={chip.icon} size={12} />}
      {chip.icon && ' '}
      {chip.text}
    </>
  );
  return (
    <Flex gap="2xs" align="center" className="stage-header__chip" data-chip={chip.id}>
      {chip.tone === 'neutral' ? (
        <Tag title={chip.title}>{body}</Tag>
      ) : (
        <Tag variant="urgency" color={chip.tone} title={chip.title}>{body}</Tag>
      )}
      {chip.action && (
        <Button size="xs" variant="ghost" disabled={chip.action.disabled} onClick={chip.action.run}>{chip.action.label}</Button>
      )}
    </Flex>
  );
};

export { ChipItem };
