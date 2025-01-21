import React from "react";
import ZoomInText from "../lib/ZoomInText";
import { useVideoConfig } from "remotion";

export const RelaxingVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return <>
    <ZoomInText text="Sample Text" separator={' '} animationDuration={2 * fps}></ZoomInText>
  </>
}
