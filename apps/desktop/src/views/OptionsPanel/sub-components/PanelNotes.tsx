/* @layer renderer-app @kind component */
import { Callout, Text } from '@drizztdourden08/tessera';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';

const PanelNotes = ({ sheet, empty }: { sheet: boolean; empty: boolean }) => {
  if (sheet) return <Callout tone="info">{OPTIONS_PANEL_TEXT.sheet}</Callout>;
  return empty ? <Text tone="muted">{OPTIONS_PANEL_TEXT.noOptions}</Text> : null;
};

export { PanelNotes };
