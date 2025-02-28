import React, { useState, useMemo, useEffect } from "react";
import { Box, Slider, Button, Typography } from "@mui/material";
import ColorPicker from "./ColorPicker";
import { BgGradient } from "../Services/Composition.interface";

interface GradientPickerProps {
  value?: BgGradient;
  onChange?: (gradient: BgGradient) => void;
  style?: React.CSSProperties;
}

const GradientPicker: React.FC<GradientPickerProps> = ({ value, onChange, style }) => {
  const [colors, setColors] = useState(value?.colors || ["#ff0000", "#0000ff"]); // Default Red & Blue
  const [angle, setAngle] = useState(value?.angle || 45);

  // Generate the gradient string dynamically
  const gradient = useMemo(
    () => `linear-gradient(${angle}deg, ${colors.join(", ")})`,
    [colors, angle]
  );

  useEffect(() => {
    onChange && onChange({ colors, angle });
  }, [colors, angle]);

  // Update color at index
  const handleColorChange = (color: string, index: number) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const handleAddColor = () => {
    setColors(prev => [...prev, '#ff0000']);
  }


  const handleRemoveColor = (index: number) => {
    if (colors?.length <= 2) return;

    setColors(prev => {
      prev.splice(index, 1);
      return [...prev];
    });
  }

  return (
    <Box sx={{ p: 3, textAlign: "center" }} style={{ ...style }}>
      {/* Gradient Preview */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          background: gradient,
          borderRadius: 2,
          mb: 2,
          boxShadow: 3,
        }}
      />

      {/* Color Pickers */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center' }}>
        {colors.map((color, index) => (
          <Box style={{ position: 'relative' }}>
            <Button
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: 1,
                height: '100%',
                margin: '0px',
                backgroundColor: 'transparent'
              }}
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => handleRemoveColor(index)}
            >X</Button>
            <ColorPicker
              label={''} name={`Color${index + 1}`} value={color} onChange={(e) => handleColorChange(e.value, index)} />
          </Box>
        ))}
        {/* Add More Colors */}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => handleAddColor()}
        >+</Button>
      </Box>

      {/* Angle Slider */}
      <Box sx={{ width: "100%", mx: "auto", mt: 3 }}>
        <Typography variant="subtitle1">Angle: {angle}°</Typography>
        <Slider
          value={angle}
          onChange={(_, newValue) => setAngle(newValue as number)}
          min={0}
          max={360}
        />
      </Box>
    </Box>
  );
};

export default GradientPicker;
