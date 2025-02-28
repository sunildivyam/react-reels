import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Chip, Box, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { VideoCategoryEnums, VideoMeta } from '../Services/youtube.interface';

interface VideoMetaFormProps {
  meta?: VideoMeta,
  onChange?: (meta: VideoMeta) => void
}

const VideoMetaForm: React.FC<VideoMetaFormProps> = ({ meta, onChange }) => {
  const [tags, setTags] = useState<string[]>(meta?.tags || []);
  const [hashTags, setHashTags] = useState<string[]>(meta?.hashTags || []);
  const [categoryId, setCategoryId] = useState<VideoCategoryEnums>(meta?.categoryId || VideoCategoryEnums.Entertainment);
  const [startPublishFrom, setStartPublishFrom] = useState<Date>(meta?.startPublishFrom || new Date());
  const [publishDelayHours, setPublishDelayHours] = useState<number>(meta?.publishDelayHours || 0);

  useEffect(() => {
    onChange && onChange({ categoryId, tags, hashTags, startPublishFrom, publishDelayHours });
  }, [categoryId, hashTags, tags, startPublishFrom, publishDelayHours]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, setItems: React.Dispatch<React.SetStateAction<string[]>>, itemsToCheck: string[]) => {
    if (event.key === ' ') {
      const input = (event.target as HTMLInputElement);
      const value = input.value.trim();
      if (value && !itemsToCheck.includes(value)) {
        setItems((prev) => [...prev, value]);
      }
      setTimeout(() => input.value = '')
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, setItems: React.Dispatch<React.SetStateAction<string[]>>, itemsToCheck: string[]) => {
    const paste = event.clipboardData.getData('text');
    const items = paste.split(' ').filter((item) => item.trim() !== '' && !itemsToCheck.includes(item.trim()));
    setItems((prev) => [...prev, ...items]);
    event.preventDefault();
  };

  const handleDelete = (item: string, setItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    setItems((prev) => prev.filter((i) => i !== item));
  };


  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Video Meta Form</Typography>
      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={tags}
        onChange={(_event, newValue) => setTags(newValue)}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              onDelete={() => handleDelete(option, setTags)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            onKeyDown={(event: any) => { handleKeyDown(event, setTags, tags); }}
            onPaste={(event: any) => handlePaste(event, setTags, tags)}
          />
        )}
      />
      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={hashTags}
        onChange={(_event, newValue) => setHashTags(newValue)}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              onDelete={() => handleDelete(option, setHashTags)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="HashTags"
            onKeyDown={(event: any) => handleKeyDown(event, setHashTags, hashTags)}
            onPaste={(event: any) => handlePaste(event, setHashTags, hashTags)}
          />
        )}
      />
      <TextField
        select
        label="Category"
        value={categoryId}
        onChange={(event: any) => setCategoryId(event.target.value)}
      >
        {Object.entries(VideoCategoryEnums).map(([key, value]) => (
          <MenuItem key={value} value={value}>
            {key}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Start Publish From"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
        value={startPublishFrom || ''}
        onChange={(event: any) => setStartPublishFrom(event.target.value)}
      />
      <TextField
        label="Publish Delay Hours"
        type="number"
        value={publishDelayHours || 0}
        onChange={(event: any) => setPublishDelayHours(Number(event.target.value))}
      />
    </Box>
  );
};

export default VideoMetaForm;
