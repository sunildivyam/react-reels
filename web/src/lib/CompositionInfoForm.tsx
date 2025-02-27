import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, Box, FormLabel } from '@mui/material';
import CompositionPropsForm from './CompositionPropsForm';
import { CompositionInfo, CompositionProps } from '../Services/Composition.interface';
import CodeBlock from './CodeBlock';
import { DEFAULT_COMPSITION_INFO } from '../Services/Composition.constants';
import CompositionIdsSelect from './CompositionIdsSelect';

interface CompositionInfoFormProps {
  initialData?: CompositionInfo;
  onChange: (data: CompositionInfo) => void;
}

const CompositionInfoForm: React.FC<CompositionInfoFormProps> = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState<CompositionInfo>(initialData || DEFAULT_COMPSITION_INFO);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    try {
      const parsedValue = type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value;
      const updatedFormData = {
        ...formData,
        [name]: parsedValue,
      };

      setFormData(updatedFormData);
      onChange && onChange(updatedFormData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDefaultPropsChange = (data: CompositionProps) => {
    const updatedFormData = {
      ...formData,
      defaultProps: data,
    };

    setFormData(updatedFormData);
    onChange && onChange(updatedFormData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCodeBlock = (jsonObj: object) => {
    setFormData(jsonObj as CompositionInfo);
    onChange && onChange(jsonObj as CompositionInfo);
  }

  const handleCompositionIdChange = (name: string, id: string) => {
    const updatedFormData = {
      ...formData,
      [name]: id,
    };

    setFormData(updatedFormData);
    onChange && onChange(updatedFormData);
  }

  return (
    <Box>
      <FormLabel style={{ display: 'flex', marginTop: '1em', marginBottom: '1em' }}>Composition Information</FormLabel>
      <CodeBlock style={{ display: 'flex', justifyContent: 'flex-end' }} value={formData} onChange={handleCodeBlock} />
      <Box display="flex" justifyContent="space-between">
        <CompositionIdsSelect value={formData.id} style={{ margin: '1em' }}
          label="Composition Id"
          name="id"
          onChange={(id) => handleCompositionIdChange('id', id as string)} />
        <CompositionIdsSelect value={formData.originalId} style={{ margin: '1em' }}
          label="Composition Original Id"
          name="originalId"
          onChange={(id) => handleCompositionIdChange('originalId', id as string)} />
      </Box>
      <FormLabel style={{ display: 'flex', marginTop: '1em' }}>Composition Meta</FormLabel>
      <Box display="flex" justifyContent="space-between">
        <TextField
          style={{ margin: '1em' }}
          label="Width"
          name="width"
          type="number"
          value={formData.width}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          style={{ margin: '1em' }}
          label="Height"
          name="height"
          type="number"
          value={formData.height}
          onChange={handleInputChange}
          fullWidth
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <TextField
          style={{ margin: '1em' }}
          label="FPS"
          name="fps"
          type="number"
          value={formData.fps}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          style={{ margin: '1em' }}
          label="Duration (seconds)"
          name="durationInSeconds"
          type="number"
          value={formData.durationInSeconds}
          onChange={handleInputChange}
          fullWidth
        />
      </Box>
      <FormLabel style={{ display: 'flex', marginTop: '1em' }}>Render Frames</FormLabel>
      <Box display="flex" justifyContent="space-between">
        <TextField
          style={{ margin: '1em' }}
          label="From (seconds)"
          name="rangeFrom"
          type="number"
          value={formData.rangeInSeconds[0]}
          onChange={(e) => {
            const updatedRange: [number | undefined, number | undefined] | [] = e.target.value === '' ? [] : [parseInt(e.target.value), formData.rangeInSeconds[1]];
            setFormData({ ...formData, rangeInSeconds: updatedRange as any });
            onChange && onChange({ ...formData, rangeInSeconds: updatedRange as any });
          }}
          fullWidth
        />
        <TextField
          style={{ margin: '1em' }}
          label="To (seconds)"
          name="rangeTo"
          type="number"
          value={formData.rangeInSeconds[1]}
          onChange={(e) => {
            const updatedRange: [number | undefined, number | undefined] | [] = e.target.value === '' ? [] : [formData.rangeInSeconds[0], parseInt(e.target.value)];
            setFormData({ ...formData, rangeInSeconds: updatedRange as any });
            onChange && onChange({ ...formData, rangeInSeconds: updatedRange as any });
          }}
          fullWidth
        />
      </Box>
      <Box style={{ marginBottom: '1em' }}>
        <label>Transparent Video</label>
        <Checkbox
          name="transparent"
          checked={formData.transparent}
          onChange={handleInputChange}
        />
      </Box>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Edit Composition Props
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Composition Props</DialogTitle>
        <DialogContent>
          <CompositionPropsForm
            initialProps={formData.defaultProps}
            onChange={handleDefaultPropsChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompositionInfoForm;
