import { AbsoluteFill, useVideoConfig } from "remotion"

export const Text: React.FC<{ children: string, color: string }> = ({ children, color }) => {
  const { width } = useVideoConfig();

  return <AbsoluteFill
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: `${color}`,
      fontSize: `${width * 0.07}px`
    }}>
    {children}
  </AbsoluteFill>
}
