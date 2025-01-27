import { random, useCurrentFrame, interpolate } from 'remotion';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { InstancedMesh, PointLight } from 'three';


const PARTICLE_SIZE_FACTOR = 1;

export interface DustProps {
  count: number;
  color: string;
  lightDistance: number;
  lightIntensity: number;
  lightColor: string;
  smoothness: number;
  particleSize: number;
  opacity: number;
  minSpeed: number;
  maxSpeed: number;
}

export const Dust: React.FC<DustProps> = ({
  count,
  color,
  lightDistance,
  lightIntensity,
  lightColor,
  smoothness,
  particleSize,
  opacity,
  minSpeed,
  maxSpeed }) => {
  const mesh = useRef<InstancedMesh>(null);
  const light = useRef<PointLight>(null);

  const frame = useCurrentFrame();

  // Generate some random positions,
  //  speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = interpolate(random('time' + i), [0, 1], [0, 100]);
      const factor = interpolate(random('factor' + i), [0, 1], [20, 120]);
      const speed = interpolate(random('speed' + i), [0, 1], [minSpeed / 1000, maxSpeed / 1000]) / 2;
      const x = interpolate(random('x' + i), [0, 1], [-50, 50]);
      const y = interpolate(random('y' + i), [0, 1], [-50, 50]);
      const z = interpolate(random('z' + i), [0, 1], [-50, 50]);

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const { current } = mesh;

    if (!current) {
      return;
    }
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, index) => {
      const { factor, speed, x, y, z } = particle;

      // Update the particle time
      const t = frame * speed;

      // Update the particle position based on the time
      // This is mostly random trigonometry functions to oscillate around the (x, y, z) point
      dummy.position.set(
        // eslint-disable-next-line no-implicit-coercion
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      // Derive an oscillating value which will be used
      // for the particle size and rotation
      const s = Math.cos(t) + PARTICLE_SIZE_FACTOR;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      // And apply the matrix to the instanced item
      current.setMatrixAt(index, dummy.matrix);
    });
    current.instanceMatrix.needsUpdate = true;
  }, [dummy, particles, frame]);

  return (
    <>
      <pointLight
        ref={light}
        distance={lightDistance}
        intensity={lightIntensity}
        color={lightColor}
        decay={2} />
      <ambientLight />

      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}>

        <dodecahedronGeometry
          args={[particleSize, smoothness]} />

        <meshPhongMaterial
          opacity={opacity}
          color={color}
          specular="yellow"
          shininess={100}
          transparent
        />
      </instancedMesh>
    </>
  );
};
