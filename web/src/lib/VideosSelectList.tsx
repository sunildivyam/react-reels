import React, { useState, useEffect } from 'react';
import { Typography, Grid2, Checkbox, FormControlLabel, Box } from '@mui/material';
import { VideoUpload } from '../Services/youtube.interface';

interface VideoSelectListProps {
  title: string;
  videos: Array<Partial<VideoUpload>>;
  onSelect?: (videoIds: Array<string>) => void;
}

const VideoSelectList: React.FC<VideoSelectListProps> = ({ title, videos, onSelect }) => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  useEffect(() => {
    onSelect && onSelect(selectedVideos);
  }, [selectedVideos]);


  useEffect(() => {
    const selecteVs = allSelected ? videos?.map(v => v.id || '') || [] : [];
    setSelectedVideos(selecteVs);
  }, [allSelected]);

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideos(prevSelected =>
      prevSelected.includes(videoId)
        ? prevSelected.filter(id => id !== videoId)
        : [...prevSelected, videoId]
    );
  };

  const handleSelectAll = () => setAllSelected(prev => !prev);

  return (
    <>
      <Box style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h5">{title}</Typography>
        <Checkbox checked={allSelected} onChange={handleSelectAll} title='Select all' />
      </Box>
      <Grid2 container spacing={2}>
        {videos.map(video => (
          <Grid2 key={video.id}>
            <FormControlLabel control={<Checkbox
              checked={selectedVideos.includes(video.id || '')}
              onChange={() => handleVideoSelect(video.id || '')}
            />} label={video.title} />
          </Grid2>
        ))}
      </Grid2>
    </>
  );
};

export default VideoSelectList;
