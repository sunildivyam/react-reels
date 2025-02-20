import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import CompositionParticlesForm from './CompositionParticlesForm';
import { CompositionParticles, CompositionProps } from '../Services/Composition.interface';
import CodeBlock from './CodeBlock';

interface CompositionPropsFormProps {
  initialProps: CompositionProps;
  onChange: (props: CompositionProps) => void;
}

const CompositionPropsForm: React.FC<CompositionPropsFormProps> = ({ initialProps, onChange }) => {
  const [props, setProps] = useState<CompositionProps>(initialProps);
  const [particlesDialogOpen, setParticlesDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    try {
      const parsedValue = type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value;

      const updatedProps = { ...props, [name]: parsedValue };

      setProps(updatedProps);
      onChange && onChange(updatedProps);
    } catch (error) {
      console.log(error);
    }
  };

  const handleParticlesChange = (particles: CompositionParticles) => {
    const updatedProps = { ...props, particles };

    setProps(updatedProps);
    onChange && onChange(updatedProps);
  };

  const handleOpenParticlesDialog = () => {
    setParticlesDialogOpen(true);
  };

  const handleCloseParticlesDialog = () => {
    setParticlesDialogOpen(false);
  };


  const handleCodeBlock = (jsonObj: object) => {
    setProps(jsonObj as CompositionProps);
    onChange && onChange(jsonObj as CompositionProps);
  }

  return (
    <Box>
      <CodeBlock style={{ display: 'flex', justifyContent: 'flex-end' }} value={props} onChange={handleCodeBlock} />
      <TextField style={{ marginTop: '1em' }}
        label="Name"
        name="name"
        value={props.name || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Title"
        name="title"
        value={props.title || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Subtitle"
        name="subTitle"
        value={props.subTitle || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em', marginBottom: '1em' }}
        label="Summary"
        name="summary"
        value={props.summary || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Translation"
        name="translation"
        value={props.translation || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Filter"
        name="filter"
        value={props.filter || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Category Image"
        name="categoryImage"
        value={props.categoryImage || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Logo"
        name="logo"
        value={props.logo || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Music"
        name="music"
        value={props.music || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Images"
        name="images"
        value={props.images ? props.images.join(', ') : ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Videos"
        name="videos"
        value={props.videos ? props.videos.join(', ') : ''}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField style={{ marginTop: '1em' }}
        label="Duration per Image (seconds)"
        name="imageSeconds"
        type="number"
        value={props.imageSeconds || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <Button style={{ margin: '1em' }} variant="outlined" color="primary" onClick={handleOpenParticlesDialog}>
        Edit Particles
      </Button>
      <Dialog open={particlesDialogOpen} onClose={handleCloseParticlesDialog}>
        <DialogTitle>Edit Particles</DialogTitle>
        <DialogContent>
          <CompositionParticlesForm
            particles={props.particles || {} as CompositionParticles}
            onChange={handleParticlesChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseParticlesDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompositionPropsForm;
