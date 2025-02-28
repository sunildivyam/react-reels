import React from 'react';
import { Checkbox, Box, Typography } from '@mui/material';

interface SelectButtonProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  imageUrl: string;
}

const SelectButton: React.FC<SelectButtonProps> = ({ checked, onChange, label, imageUrl }) => {
  return (
    <Box
      display="flex"
      alignItems="center" border={1} borderRadius={4}
      onClick={() => onChange({ target: { checked: !checked } } as any)}
      style={{ overflow: 'hidden', cursor: 'pointer', backgroundColor: checked ? 'lightblue' : 'transparent' }}>
      <Checkbox checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <Box display="flex" alignItems="center" padding={1}>
        <img src={imageUrl} alt={label} style={{ width: 100, height: 100, marginRight: 8 }} />
        <Typography variant="body1">{label}</Typography>
      </Box>
    </Box>
  );
};

export default SelectButton;
