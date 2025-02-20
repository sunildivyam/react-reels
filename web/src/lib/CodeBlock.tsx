import { Box, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';



interface CodeBlockProps {
  value: object;
  style?: React.CSSProperties;
  onChange: (value: object) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ value, onChange, style }) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(JSON.stringify(value, null, '\t'));


  const handleButtonClick = () => {
    setTempValue(JSON.stringify(value, null, '\t'));
    setOpen(true);
  };

  const handleOk = () => {
    onChange && onChange(JSON.parse(tempValue));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box style={{ ...style }}>
      <Button variant="outlined" onClick={handleButtonClick}>JSON</Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Edit JSON</DialogTitle>
        <DialogContent>
          <Button
            style={{ position: 'absolute', top: 10, right: 10 }}
            onClick={() => navigator.clipboard.writeText(tempValue)}
          >
            Copy
          </Button>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            InputProps={{
              style: { fontFamily: 'monospace' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CodeBlock;
