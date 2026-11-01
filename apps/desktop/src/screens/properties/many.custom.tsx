/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { showForKind } from '../../asset-config/show-for-kind';
import { MANY_KIND } from '../../properties-subject/many-subject.constants';
import { ManyProperties } from '../../views/ManyProperties';

const meta: ScreenMeta = { title: 'Selection', showHeader: true, icon: 'file', order: 0, when: showForKind(MANY_KIND) };

const searchEntries: SearchEntrySeed[] = [];

const ManyScreen = () => <ManyProperties />;

export default ManyScreen;
export { meta, searchEntries };
