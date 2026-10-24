/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Button, Field, Flex, TextInput } from '@drizztdourden08/tessera';
import { COLLISION_TEXT } from '../../../tilemap/collision/collision.constants';
import { parsePoints } from '../../../tilemap/collision/parse-points';
import { pointsText } from '../../../tilemap/collision/points-text';
import { setCollision } from '../../../tilemap/set-collision';
import type { CollisionProps } from '../TilesetPanel.type';

const CollisionPointsField = ({ tile }: CollisionProps) => {
  const { collision } = tile;
  const [draft, setDraft] = useState<string | null>(null);
  if (collision?.kind !== 'polygon') return null;
  const commit = (): void => {
    const points = draft === null ? null : parsePoints(draft);
    if (points && points.length >= 3) setCollision(tile.key, { kind: 'polygon', points });
    setDraft(null);
  };
  return (
    <Flex gap="xs" align="end" wrap>
      <Field label={COLLISION_TEXT.points} hint={COLLISION_TEXT.pointsHint}>
        <TextInput
          value={draft ?? pointsText(collision.points)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => event.key === 'Enter' && commit()}
        />
      </Field>
      <Button
        size="sm"
        variant="tertiary"
        disabled={collision.points.length <= 3}
        onClick={() => setCollision(tile.key, { kind: 'polygon', points: collision.points.slice(0, -1) })}
      >
        {COLLISION_TEXT.removePoint}
      </Button>
    </Flex>
  );
};

export { CollisionPointsField };
