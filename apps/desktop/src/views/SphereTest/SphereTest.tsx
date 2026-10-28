/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { SPHERE } from '../../palette-ramps/palette-ramps.constants';
import { spherePixels } from '../../palette-ramps/sphere-pixels';
import type { SphereTestProps } from './SphereTest.type';
import './SphereTest.css';

const SphereTest = ({ colours, label, size = 'md' }: SphereTestProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = ref.current?.getContext('2d');
    if (!context) return;
    context.putImageData(new ImageData(spherePixels(colours, SPHERE.size), SPHERE.size, SPHERE.size), 0, 0);
  }, [colours]);
  return <Canvas ref={ref} width={SPHERE.size} height={SPHERE.size} role="img" aria-label={label} className={`sphere-test sphere-test--${size}`} />;
};

export { SphereTest };
