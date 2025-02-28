import React, { useState } from "react";
import { TextField, Popover, Box } from "@mui/material";
import { BgGradient } from "../Services/Composition.interface";
import { toGradientString } from "../Utils/utils";
import GradientPicker from "./GradientPicker";

interface GradientInputProps {
  label?: string;
  name?: string;
  value?: BgGradient;
  style?: React.CSSProperties;
  onChange: (event: { name?: string; value: BgGradient; type: string }) => void;
}

const GradientInput: React.FC<GradientInputProps> = ({ label = "Gradient Colors", name, value, style, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGradientChange = (gradient: BgGradient) => {
    onChange && onChange({ name, value: gradient, type: 'BgGradient' });
  };

  return (
    <Box style={{ display: "flex", alignItems: "center", ...style }}>
      <TextField
        label={label}
        name={name}
        value={toGradientString(value)}
        onClick={handleClick}
        fullWidth
        InputProps={{
          style: {
            color: value ? '#fff' : '#000',
            background: value ? toGradientString(value) : 'inherit'
          },
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <GradientPicker value={value} onChange={handleGradientChange} />
      </Popover>
    </Box>
  );
};

export default GradientInput;
