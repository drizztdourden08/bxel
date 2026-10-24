/* @layer renderer-app @kind component */
import type { ToolOptionsProps } from '../ContextBar.type';
import { OPTION_VIEWS } from './ToolOptions.constants';

const ToolOptions = ({ kinds }: ToolOptionsProps) => (
  <>
    {kinds.map((kind) => {
      const View = OPTION_VIEWS[kind];
      return <View key={kind} />;
    })}
  </>
);

export { ToolOptions };
