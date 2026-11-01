/* @layer renderer-app @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { revealEntry } from '../../../project-browser/reveal-entry';
import { useBrowserContext } from '../behavior/useBrowserContext';
import type { ReferenceListProps } from '../ProjectBrowser.type';

const ReferenceList = ({ title, names }: ReferenceListProps) => {
  const { model } = useBrowserContext();
  if (names.length === 0) return null;
  return (
    <Box className="browser-references__group" role="group" aria-label={title}>
      <Text as="span" variant="caption" tone="muted">
        {title}
      </Text>
      <Box className="browser-references__list">
        {names.map((name) => {
          const target = model.everyFile.find((each) => each.row.name === name);
          return (
            <Button key={name} size="sm" variant="tertiary" disabled={target === undefined} aria-label={BROWSER_TEXT.revealReference(name)} onClick={() => target && revealEntry(target)}>
              {name}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

const PreviewReferences = ({ entry }: { readonly entry: FileEntry }) => (
  <Box className="browser-references">
    <ReferenceList title={BROWSER_TEXT.usesTitle} names={entry.facts.uses} />
    <ReferenceList title={BROWSER_TEXT.usedByTitle} names={entry.facts.usedBy} />
  </Box>
);

export { PreviewReferences };
