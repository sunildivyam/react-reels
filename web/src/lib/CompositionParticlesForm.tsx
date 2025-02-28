import { useState } from "react";
import { CompositionParticles } from "../Services/Composition.interface";
import { Grid2, TextField } from "@mui/material";
import ColorPicker from "./ColorPicker";
import CodeBlock from "./CodeBlock";

interface CompositionParticlesProps {
  particles: CompositionParticles;
  onChange: (particles: CompositionParticles) => void;
}

const CompositionParticlesForm: React.FC<CompositionParticlesProps> = ({ particles, onChange }) => {
  const [localParticles, setLocalParticles] = useState(particles || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    try {
      const parsedValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value;

      const updatedProps = {
        ...localParticles,
        [name]: parsedValue,
      };

      setLocalParticles(updatedProps);
      onChange(updatedProps);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCodeBlock = (jsonObj: object) => {
    setLocalParticles(jsonObj as CompositionParticles);
    onChange && onChange(jsonObj as CompositionParticles);
  }

  return (<>
    <CodeBlock style={{ display: 'flex', justifyContent: 'flex-end' }} value={localParticles} onChange={handleCodeBlock} />
    <Grid2 container spacing={2}>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Count"
          name="count"
          type="number"
          value={localParticles.count}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Speed Min"
          name="speed.min"
          type="number"
          value={localParticles.speed?.min}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Speed Max"
          name="speed.max"
          type="number"
          value={localParticles.speed?.max}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Opacity"
          name="opacity"
          type="number"
          value={localParticles.opacity}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Smoothness"
          name="smoothness"
          type="number"
          value={localParticles.smoothness}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Size"
          name="size"
          type="number"
          value={localParticles.size}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <ColorPicker
          style={{ marginTop: '1em' }}
          label="Color"
          name="color"
          value={localParticles.color}
          onChange={(e) => handleChange({ target: e } as React.ChangeEvent<HTMLInputElement>)}
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Light Distance"
          name="lightDistance"
          type="number"
          value={localParticles.lightDistance}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Light Intensity"
          name="lightIntensity"
          type="number"
          value={localParticles.lightIntensity}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <ColorPicker style={{ marginTop: '1em' }}
          label="Light Color"
          name="lightColor"
          value={localParticles.lightColor}
          onChange={(e) => handleChange({ target: e } as React.ChangeEvent<HTMLInputElement>)}
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Camera FOV"
          name="cameraFov"
          type="number"
          value={localParticles.cameraFov}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Camera Near"
          name="cameraNear"
          type="number"
          value={localParticles.cameraNear}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Camera Far"
          name="cameraFar"
          type="number"
          value={localParticles.cameraFar}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField style={{ marginTop: '1em' }}
          label="Shininess"
          name="shininess"
          type="number"
          value={localParticles.shininess}
          onChange={handleChange}
          fullWidth
        />
      </Grid2>
    </Grid2>
  </>);
};

export default CompositionParticlesForm;
