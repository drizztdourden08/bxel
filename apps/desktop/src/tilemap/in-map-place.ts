/* @layer renderer-app @kind logic */
import { currentContext } from '../ui-context/current-context';

const inMapPlace = (): boolean => currentContext().surface === 'map';

export { inMapPlace };
