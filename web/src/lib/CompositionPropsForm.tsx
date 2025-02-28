import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import CompositionParticlesForm from './CompositionParticlesForm';
import { CompositionParticles, CompositionProps } from '../Services/Composition.interface';
import CodeBlock from './CodeBlock';
import AssetsSelectInput from './AssetsSelectInput';
import GradientInput from './GradientInput';

interface CompositionPropsFormProps {
  initialProps: CompositionProps;
  onChange: (props: CompositionProps) => void;
}


const CompositionPropsForm: React.FC<CompositionPropsFormProps> = ({ initialProps, onChange }) => {
  const [props, setProps] = useState<CompositionProps>(initialProps);
  const [particlesDialogOpen, setParticlesDialogOpen] = useState(false);

  const handleInputChange = (e: any) => {
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

  const handleAssetsChange = (name: string, strAssets: string[]) => {
    let updatedProps;
    if (name === 'videos') {
      updatedProps = { ...props, [name]: strAssets.map(ast => ({ src: ast, duration: 0 })) };
    } else {
      updatedProps = { ...props, [name]: strAssets };
    }


    setProps(updatedProps);
    onChange && onChange(updatedProps);
  }

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

  // const handleImagesUpload = (files: string[]) => {
  //   console.log(files);
  // }

  return (<>
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
        label="Duration per Image (seconds)"
        name="imageSeconds"
        type="number"
        value={props.imageSeconds || ''}
        onChange={handleInputChange}
        fullWidth
      />
      <GradientInput style={{ marginTop: '1em', marginBottom: '1em' }}
        label="Background Gradient"
        name="bgGradient"
        value={props.bgGradient}
        onChange={({ value, name, type }) => handleInputChange({ target: { name, type, value } })}
      />
      <AssetsSelectInput singleSelect value={[props.categoryImage || '']} assetType='images' label='Category Image' name='categoryImage'
        onChange={(categoryImage) => handleInputChange({ target: { name: 'categoryImage', value: categoryImage as string, type: 'text' } })} />

      <AssetsSelectInput singleSelect value={[props.logo || '']} assetType='images' label='Logo' name='logo'
        onChange={(logo) => handleInputChange({ target: { name: 'logo', value: logo as string, type: 'text' } })} />

      <AssetsSelectInput singleSelect value={[props.music || '']} assetType='music' label='Music' name='music'
        onChange={(music) => handleInputChange({ target: { name: 'music', value: music as string, type: 'text' } })} />

      <AssetsSelectInput value={props.images} assetType='images' label='Images' name='images'
        onChange={(images) => handleAssetsChange('images', images as string[])} />

      <AssetsSelectInput value={props.videos?.map(v => v.src)} assetType='videos' label='Videos' name='videos'
        onChange={(videos) => handleAssetsChange('videos', videos as string[])} />

      <Button style={{ margin: '1em' }} variant="outlined" color="primary" onClick={handleOpenParticlesDialog}>
        Edit Particles
      </Button>

    </Box>
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
  </>);
};

export default CompositionPropsForm;
