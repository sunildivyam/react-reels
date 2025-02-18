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
  const handleRandomSelect = (e: any) => {
    const count = parseInt(e.target.value, 10);
    if (count === videos.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
      const randomVideos = videos
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .map((v) => v.id || '');
      setSelectedVideos(randomVideos);
    }
  };

  return (
    <>
      <Box style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h5">{title} ({selectedVideos.length}/{videos.length})</Typography>

      </Box>
      <Box style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
        <Checkbox style={{ marginRight: '10px' }} checked={allSelected} onChange={handleSelectAll} title='Select all' />
        <FormControlLabel
          control={
            <select onChange={handleRandomSelect} style={{ padding: '10px' }}>
              <option value="">Select Randomly</option>
              {[10, 30, 50, 70, 100, 200, videos.length].map((count) => (
                <option key={count} value={count}>
                  {count === videos.length ? `${count} (All)` : count}
                </option>
              ))}
            </select>
          }
          label=""
        />
      </Box>
      <Grid2 container spacing={2}>
        {videos.map(video => (
          <Grid2 key={video.id} style={{ backgroundColor: '#e9e9e9', borderRadius: '0.5em', padding: '1em' }}>
            <FormControlLabel control={<Checkbox
              checked={selectedVideos.includes(video.id || '')}
              onChange={() => handleVideoSelect(video.id || '')}
            />} label={<>
              <Typography component={'h5'}>{video.title}</Typography>
              <div style={{ marginTop: '1em' }}>
                {video.description?.split('\n').map((line, index) => (
                  <Typography component="p" key={index}>
                    {line || ' '}
                  </Typography>
                ))}
              </div>
              <Typography style={{ marginTop: '1em' }} component={'p'}>File Path: {video.videoFilePath}</Typography>
              <Typography style={{ marginTop: '1em' }} component={'p'}>Added to playlists: {video.playlistIds?.join(', ')}</Typography>
              <Typography style={{ marginTop: '1em' }} component={'p'}>Will Publish at: {video.publishAt || ''}</Typography>
              <Typography style={{ marginTop: '1em' }} component={'p'}>YouTube Category: {video.categoryId}</Typography>
            </>} />
          </Grid2>
        ))}
      </Grid2>
    </>
  );
};

export default VideoSelectList;
