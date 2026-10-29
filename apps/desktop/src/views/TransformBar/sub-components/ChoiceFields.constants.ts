/* @layer renderer-app @kind config */
import { ALGORITHM_LABELS, ALGORITHM_NOTES } from '@bxel/raster';
import { BOUNDS_BAR_CHOICES, BOUNDS_BAR_NOTES, METHOD_CHOICES } from '../TransformBar.constants';

const METHOD_OPTIONS = METHOD_CHOICES.map((each) => ({ value: each, label: ALGORITHM_LABELS[each], description: ALGORITHM_NOTES[each] }));

const BOUNDS_OPTIONS = BOUNDS_BAR_CHOICES.map((each) => ({ value: each.value, label: each.label, title: BOUNDS_BAR_NOTES[each.value] }));

export { BOUNDS_OPTIONS, METHOD_OPTIONS };
