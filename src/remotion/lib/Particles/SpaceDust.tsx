import React, { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Dust, DustProps } from './Dust';
import { ThreeCanvas } from '@remotion/three';
import { Camera } from '@react-three/fiber';

const DEFAULT_PROPS = {
  count: 1000,
  color: 'rgb(11, 133, 255)',
  lightDistance: 0,
  lightIntensity: 1000,
  lightColor: 'rgb(0, 165, 231)',
  fov: 100,
  aspect: 0,
  near: 0,
  far: 30,
  smoothness: 5,
  particleSize: 0.5,
  opacity: 0.3,
  minSpeed: 1,
  maxSpeed: 10,
  shininess: 100
}

export interface CameraProps {
  readonly fov?: number;
  readonly aspect?: number;
  readonly near?: number;
  readonly far?: number;
}

export interface SpaceDustProps extends DustProps, CameraProps {
  readonly style?: React.CSSProperties,
}

export const SpaceDust: React.FC<SpaceDustProps> = ({
  style,
  count,
  color,
  lightDistance,
  lightIntensity,
  lightColor,
  smoothness,
  particleSize,
  opacity,
  minSpeed,
  maxSpeed,
  fov,
  aspect,
  near,
  far,
  shininess
}) => {
  count = count ?? DEFAULT_PROPS.count;
  fov = fov ?? DEFAULT_PROPS.fov;
  aspect = aspect ?? DEFAULT_PROPS.aspect;
  near = near ?? DEFAULT_PROPS.near;
  far = far ?? DEFAULT_PROPS.far;
  color = color ?? DEFAULT_PROPS.color;
  lightDistance = lightDistance ?? DEFAULT_PROPS.lightDistance;
  lightIntensity = lightIntensity ?? DEFAULT_PROPS.lightIntensity;
  lightColor = lightColor ?? DEFAULT_PROPS.lightColor;
  smoothness = smoothness ?? DEFAULT_PROPS.smoothness;
  particleSize = particleSize ?? DEFAULT_PROPS.particleSize;
  opacity = opacity ?? DEFAULT_PROPS.opacity;
  minSpeed = minSpeed ?? DEFAULT_PROPS.minSpeed;
  maxSpeed = maxSpeed ?? DEFAULT_PROPS.maxSpeed;
  shininess = shininess ?? DEFAULT_PROPS.shininess;

  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{ ...style }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov, position: [aspect, near, far] }}
      >
        <Dust
          count={count}
          color={color}
          lightDistance={lightDistance}
          lightIntensity={lightIntensity}
          lightColor={lightColor}
          smoothness={smoothness}
          particleSize={particleSize}
          opacity={opacity}
          minSpeed={minSpeed}
          maxSpeed={maxSpeed}
          shininess={shininess} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
