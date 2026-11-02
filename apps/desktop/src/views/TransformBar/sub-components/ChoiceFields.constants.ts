/* @layer renderer-app @kind config */
import { ALGORITHM_LABELS, ALGORITHM_NOTES } from '@bxel/raster';
import type { ResampleAlgorithm } from '@bxel/raster';
import { magnifyChoices } from '../../../editor/transform/magnify-choices';
import type { TransformSpec } from '../../../editor/transform/transform.type';
import { BOUNDS_BAR_CHOICES, BOUNDS_BAR_NOTES, METHOD_CHOICES } from '../TransformBar.constants';

const optionOf = (each: ResampleAlgorithm) => ({ value: each, label: ALGORITHM_LABELS[each], description: ALGORITHM_NOTES[each] });

const methodChoices = (spec: TransformSpec): readonly ResampleAlgorithm[] => [...METHOD_CHOICES, ...magnifyChoices(spec)];

const methodOptions = (spec: TransformSpec) => methodChoices(spec).map(optionOf);

const BOUNDS_OPTIONS = BOUNDS_BAR_CHOICES.map((each) => ({ value: each.value, label: each.label, title: BOUNDS_BAR_NOTES[each.value] }));

export { BOUNDS_OPTIONS, methodChoices, methodOptions };
