import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { getCompositionIds } from '../Services/Composition.service';

interface CompositionIdsSelectProps {
  value?: string | string[];
  multiSelect?: boolean;
  style?: React.CSSProperties;
  label?: string;
  name?: string;
  onChange: (value: string | string[]) => void;
}

const CompositionIdsSelect: React.FC<CompositionIdsSelectProps> = ({ value, multiSelect = false, style, label, name, onChange }) => {
  const [compositionIds, setCompositionIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<unknown>(multiSelect ? value || [] : value || '');

  useEffect(() => {
    !compositionIds?.length && getCompositionIds()
      .then((ids => setCompositionIds(ids)))
      .catch((() => setCompositionIds([])));
  }, []);

  const handleChange = (value: string[] | string) => {
    setSelectedIds(value);
    onChange(value as string | string[]);
  };


  if (multiSelect) {
    return <FormControl style={{ ...style }} variant="outlined" fullWidth>
      <InputLabel id="composition-ids-select-label">{label}</InputLabel>
      <Select
        name={name}
        labelId="composition-ids-select-label"
        multiple={multiSelect}
        value={selectedIds as string[]}
        onChange={(e) => handleChange(e.target.value as string[])}
        input={<OutlinedInput label={label} />}
        renderValue={(selected: string[]) => selected.join(', ')}
      >
        {compositionIds.map((id) => (
          <MenuItem key={id} value={id}>
            {multiSelect && <Checkbox checked={(selectedIds as string[]).indexOf(id) > -1} />}
            <ListItemText primary={id} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  } else {
    return <FormControl style={{ ...style }} variant="outlined" fullWidth>
      <InputLabel id="composition-ids-select-label">{label}</InputLabel>
      <Select
        name={name}
        labelId="composition-ids-select-label"
        multiple={multiSelect}
        value={selectedIds as string}
        onChange={(e) => handleChange(e.target.value as string)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected: string) => selected}
      >
        {compositionIds.map((id) => (
          <MenuItem key={id} value={id}>
            {multiSelect && <Checkbox checked={(selectedIds as string[]).indexOf(id) > -1} />}
            <ListItemText primary={id} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  }
};

export default CompositionIdsSelect;
