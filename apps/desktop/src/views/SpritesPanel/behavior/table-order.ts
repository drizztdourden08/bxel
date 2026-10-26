/* @layer renderer-app @kind logic */
import type { DataTableHandle } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import type { SpriteId } from '@bxel/document';
import type { ManagerModel } from '../SpritesPanel.type';

const tableOrder = (table: RefObject<DataTableHandle | null>, model: ManagerModel): readonly SpriteId[] => {
  const keys = table.current?.getRects().map((item) => item.key) ?? [];
  if (keys.length === 0) return model.order;
  const known = new Map(model.artwork.sprites.map((sprite): [string, SpriteId] => [sprite.id, sprite.id]));
  return keys.flatMap((key) => known.get(key) ?? []);
};

export { tableOrder };
