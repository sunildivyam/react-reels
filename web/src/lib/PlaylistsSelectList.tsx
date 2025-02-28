
import React, { useState, useEffect } from 'react';
import { Typography, Grid2, Checkbox, Box } from '@mui/material';
import { VideoPlaylist } from '../Services/youtube.interface';
import SelectButton from './SelectButton';

interface PlaylistsSelectListProps {
  title: string;
  playlists: Array<Partial<VideoPlaylist>>;
  onSelect?: (videoIds: Array<string>) => void;
}

const PlaylistsSelectList: React.FC<PlaylistsSelectListProps> = ({ title, playlists, onSelect }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  useEffect(() => {
    onSelect && onSelect(selectedPlaylists);
  }, [selectedPlaylists]);

  useEffect(() => {
    const selectePs = allSelected ? playlists?.map(p => p.id || '') || [] : [];
    setSelectedPlaylists(selectePs);
  }, [allSelected]);

  const handleSelect = (videoId: string) => {
    setSelectedPlaylists(prevSelected =>
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
        {playlists.map(playlist => (
          <Grid2 key={playlist.id}>
            <SelectButton
              checked={selectedPlaylists.includes(playlist.id || '')}
              label={playlist.title || ''}
              imageUrl={playlist.thumbnails?.default?.url || ''}
              onChange={() => handleSelect(playlist.id || '')} />
          </Grid2>
        ))}
      </Grid2>
    </>
  );
};

export default PlaylistsSelectList;
