import React, { useState } from "react";
import { TextField, Popover, Box } from "@mui/material";
import { SketchPicker } from "react-color";

interface ColorPickerProps {
  label?: string;
  name?: string;
  value: string;
  style?: React.CSSProperties;
  onChange: (event: { name?: string; value: string; type: string }) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label = "Pick a color", name, value, style, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color: { hex: string }) => {
    onChange && onChange({ name, value: color.hex, type: 'text' });
  };

  return (
    <Box style={{ display: "flex", alignItems: "center", ...style }}>
      <TextField
        label={label}
        name={name}
        value={value}
        onClick={handleClick}
        fullWidth
        InputProps={{
          style: {
            color: value ? '#fff' : '#000',
            backgroundColor: value || 'inherit'
          },
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <SketchPicker color={value} onChangeComplete={handleColorChange} />
      </Popover>
    </Box>
  );
};

export default ColorPicker;
