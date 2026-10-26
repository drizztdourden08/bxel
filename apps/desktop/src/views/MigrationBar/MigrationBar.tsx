/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Button, DialogShell, Flex, Paragraph, Stack, Text } from '@drizztdourden08/tessera';
import { runFileAction } from '../../files/run-file-action';
import { useMigration } from './behavior/useMigration';
import { MIGRATION_TEXT } from './MigrationBar.constants';
import './MigrationBar.css';

const MigrationBar = () => {
  const migration = useMigration();
  const [listing, setListing] = useState(false);
  if (!migration) return null;
  const close = (): void => setListing(false);
  return (
    <>
      <Flex wrap gap="md" align="center" role="status" aria-label={MIGRATION_TEXT.region} className="migration-bar">
        <Text as="span" variant="label">{migration.notice}</Text>
        <Flex gap="sm" align="center" className="migration-bar__actions">
          <Button variant="secondary" onClick={() => setListing(true)}>{MIGRATION_TEXT.show}</Button>
          <Button variant="primary" onClick={() => void runFileAction({ kind: 'saveAll' })}>{MIGRATION_TEXT.saveAll}</Button>
        </Flex>
      </Flex>
      {listing && (
        <DialogShell open title={MIGRATION_TEXT.title} onClose={close} actions={<Button variant="primary" onClick={close}>{MIGRATION_TEXT.close}</Button>}>
          <Stack gap="sm">
            <Paragraph tone="dim">{MIGRATION_TEXT.intro}</Paragraph>
            <Stack gap="xs" role="list" aria-label={MIGRATION_TEXT.list}>
              {migration.lines.map((line) => <Text key={line.key} role="listitem">{line.text}</Text>)}
            </Stack>
          </Stack>
        </DialogShell>
      )}
    </>
  );
};

export { MigrationBar };
