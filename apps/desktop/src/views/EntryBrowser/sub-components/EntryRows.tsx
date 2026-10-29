/* @layer renderer-app @kind component */
import { VirtualList } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { entryId } from '../../../sheet-manager/entry-id';
import type { BrowserBodyProps } from '../EntryBrowser.type';
import { EntryRow } from './EntryRow';

const EntryRows = ({ label, artwork, shown, picked, pick, activate, dragFor }: BrowserBodyProps) => {
  const [hot, setHot] = useState<string | null>(null);
  return (
    <VirtualList
      label={label}
      items={shown}
      getKey={entryId}
      rowHeight="size-40"
      renderItem={(fact) => {
        const key = entryId(fact);
        return (
          <EntryRow
            fact={fact}
            artwork={artwork}
            chosen={picked.includes(key)}
            hot={hot === key}
            drag={dragFor(key)}
            onPick={(how) => pick(key, how)}
            onActivate={() => activate(key)}
            onHot={(on) => setHot(on ? key : null)}
          />
        );
      }}
    />
  );
};

export { EntryRows };
