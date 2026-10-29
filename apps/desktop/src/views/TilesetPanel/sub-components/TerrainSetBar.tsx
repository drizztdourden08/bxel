/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Button, ButtonGroup, Flex, Icon, IconButton, Select, Stack, TextInput } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setTerrainSets } from '../../../tilemap/set-terrain-sets';
import { newTerrainSet } from '../../../tilemap/terrain/new-terrain-set';
import { TERRAIN_KIND_CHOICES, TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { TerrainBarProps } from '../behavior/terrain-panel.type';

const TerrainSetBar = ({ sets, set }: TerrainBarProps) => {
  const select = useTilesetViewStore((state) => state.setTerrainSetId);
  const [draft, setDraft] = useState<string | null>(null);
  const rename = (): void => {
    const name = (draft ?? '').trim();
    const clash = sets.some((each) => each.id !== set.id && each.name.toLowerCase() === name.toLowerCase());
    if (name !== '' && name !== set.name && !clash) setTerrainSets(sets.map((each) => (each.id === set.id ? { ...each, name } : each)));
    setDraft(null);
  };
  const add = (kind: (typeof TERRAIN_KIND_CHOICES)[number]['kind']): void => {
    const made = newTerrainSet(kind, sets);
    if (setTerrainSets([...sets, made])) select(made.id);
  };
  const remove = (): void => {
    const rest = sets.filter((each) => each.id !== set.id);
    if (setTerrainSets(rest.length > 0 ? rest : null)) select(rest[0]?.id ?? null);
  };
  return (
    <Stack gap="xs">
      <Flex gap="xs" align="center">
        <Select size="sm" aria-label={TERRAIN_TEXT.setPicker} options={sets.map((each) => ({ value: each.id, label: each.name }))} value={set.id} onChange={select} />
        <TextInput
          size="sm"
          aria-label={TERRAIN_TEXT.setName}
          value={draft ?? set.name}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={rename}
          onKeyDown={(event) => event.key === 'Enter' && rename()}
        />
        <IconButton label={TERRAIN_TEXT.deleteSet} size="sm" onClick={remove}>
          <Icon name="trash-2" size={16} />
        </IconButton>
      </Flex>
      <ButtonGroup aria-label={TERRAIN_TEXT.start}>
        {TERRAIN_KIND_CHOICES.map((choice) => (
          <Button key={choice.kind} size="sm" variant="tertiary" title={choice.description} onClick={() => add(choice.kind)}>
            {`+ ${choice.label}`}
          </Button>
        ))}
      </ButtonGroup>
    </Stack>
  );
};

export { TerrainSetBar };
