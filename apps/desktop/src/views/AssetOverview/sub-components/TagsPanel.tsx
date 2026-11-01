/* @layer renderer-app @kind component */
import { toast } from '@drizztdourden08/brock-react';
import { Box, PanelContainer, Tag, Text, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import { editOrganise } from '../../../organise/edit-organise';
import type { OrganiseOp } from '../../../organise/organise.type';
import { organiseOf } from '../../../organise/organise-of';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { OverviewPartProps } from '../AssetOverview.type';

const run = (op: OrganiseOp): void => {
  void editOrganise(op).then((outcome) => {
    if (!outcome.ok) toast(outcome.message, { variant: 'warning' });
  });
};

const TagsPanel = ({ model }: OverviewPartProps) => {
  const project = useProjectStore((state) => state.project);
  const [typed, setTyped] = useState('');
  if (project === null) return null;
  const id = model.focus.key.id;
  const held = organiseOf(project.manifest).tags[id] ?? [];
  const editable = !model.focus.readOnly;
  const commit = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' || typed.trim() === '') return;
    event.preventDefault();
    run({ op: 'tag', assets: [id], tags: typed.split(',') });
    setTyped('');
  };
  return (
    <PanelContainer title={OVERVIEW_TEXT.tagsTitle} level={3}>
      {held.length === 0 ? (
        <Text tone="muted">{OVERVIEW_TEXT.noTags}</Text>
      ) : (
        <Box role="group" aria-label={OVERVIEW_TEXT.tagsLabel}>
          {held.map((tag) => (
            <Tag key={tag} name={tag} {...(editable ? { onRemove: () => run({ op: 'untag', assets: [id], tags: [tag] }) } : {})}>
              {tag}
            </Tag>
          ))}
        </Box>
      )}
      {editable && <TextInput value={typed} placeholder={OVERVIEW_TEXT.addTagHint} aria-label={OVERVIEW_TEXT.addTagLabel} onChange={(event) => setTyped(event.target.value)} onKeyDown={commit} />}
    </PanelContainer>
  );
};

export { TagsPanel };
