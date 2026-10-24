/* @layer renderer-app @kind component */
import type { AssetControlProps } from './AssetControl.type';
import { BankControl } from './sub-components/BankControl';
import { LimitControl } from './sub-components/LimitControl';
import { PlatformControl } from './sub-components/PlatformControl';
import { PresetsControl } from './sub-components/PresetsControl';
import { ReportControl } from './sub-components/ReportControl';
import { SetControl } from './sub-components/SetControl';

const AssetControl = ({ field }: AssetControlProps) => {
  switch (field) {
    case 'sprite.bank':
      return <BankControl />;
    case 'palette.cap':
      return <LimitControl />;
    case 'palette.set':
      return <SetControl />;
    case 'sprite.platform':
      return <PlatformControl />;
    case 'sprite.platformReport':
      return <ReportControl />;
    case 'sprite.exportPresets':
      return <PresetsControl group="sprite" />;
    case 'sheet.exportPresets':
      return <PresetsControl group="sheet" />;
    default:
      return null;
  }
};

export { AssetControl };
