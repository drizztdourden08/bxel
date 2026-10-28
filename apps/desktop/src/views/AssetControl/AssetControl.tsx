/* @layer renderer-app @kind component */
import { PAIR_FIELDS } from './AssetControl.constants';
import type { AssetControlProps } from './AssetControl.type';
import { BankControl } from './sub-components/BankControl';
import { LimitControl } from './sub-components/LimitControl';
import { PairControl } from './sub-components/PairControl';
import { PlatformControl } from './sub-components/PlatformControl';
import { PresetsControl } from './sub-components/PresetsControl';
import { ReportControl } from './sub-components/ReportControl';

const AssetControl = ({ field }: AssetControlProps) => {
  switch (field) {
    case 'sprite.bank':
      return <BankControl />;
    case 'palette.cap':
      return <LimitControl />;
    case 'sprite.platform':
      return <PlatformControl />;
    case 'sprite.platformReport':
      return <ReportControl />;
    case 'sprite.exportPresets':
      return <PresetsControl group="sprite" />;
    case 'sheet.exportPresets':
      return <PresetsControl group="sheet" />;
    default: {
      const pair = PAIR_FIELDS[field];
      return pair ? <PairControl spec={pair} /> : null;
    }
  }
};

export { AssetControl };
