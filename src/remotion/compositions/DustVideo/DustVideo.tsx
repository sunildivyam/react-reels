import { zColor } from "@remotion/zod-types"
import { z } from "zod"
import { SpaceDust } from "../../lib/Particles/SpaceDust";

export const DustVideoSchema = z.object({
  count: z.number(),
  speed: z.object({ min: z.number(), max: z.number() }),
  opacity: z.number(),
  smoothness: z.number(),
  size: z.number(),
  color: zColor(),
  lightDistance: z.number(),
  lightIntensity: z.number(),
  lightColor: zColor(),
  cameraFov: z.number(),
  cameraNear: z.number(),
  cameraFar: z.number(),
  shininess: z.number(),
  bgGradient: z.object({ color1: zColor(), color2: zColor(), color3: zColor(), color4: zColor() }).optional(),
});

export type DustVideoProps = z.infer<typeof DustVideoSchema>;

export const DustVideo: React.FC<DustVideoProps> = ({
  count,
  speed,
  opacity,
  smoothness,
  size,
  color,
  lightDistance,
  lightIntensity,
  lightColor,
  cameraFov,
  cameraNear,
  cameraFar,
  shininess,
  bgGradient }) => {

  const background = bgGradient ? `linear-gradient(110deg, ${bgGradient?.color1} 0%, ${bgGradient?.color2} 30%, ${bgGradient?.color3} 50%, ${bgGradient?.color4} 90%)` : 'none';

  return <SpaceDust
    style={{
      background
    }}
    count={count}
    minSpeed={speed.min}
    maxSpeed={speed.max}
    opacity={opacity}
    smoothness={smoothness}
    particleSize={size}
    color={color}
    lightDistance={lightDistance}
    lightIntensity={lightIntensity}
    lightColor={lightColor}
    fov={cameraFov}
    near={cameraNear}
    far={cameraFar}
    shininess={shininess}
  />
}
