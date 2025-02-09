import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, Checkbox, CardMedia, Grid2 } from '@mui/material';
import { ChannelInfo, VideoPlaylist } from '../Services/youtube.interface';
import { getYoutubeChannel, getYoutubePlaylists, youtubeAuthorize, youtubeAuthorized } from '../Services/YouTube.service';

const YoutubeHome: React.FC = () => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [playlists, setPlaylists] = useState<Array<VideoPlaylist>>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    youtubeAuthorized().then((isAuthorized) => setIsLoggedIn(isAuthorized)).catch(() => setIsLoggedIn(false))
  }, []);

  useEffect(() => {
    if (isLoggedIn && !channelInfo) {
      getYoutubeChannel().then(ch => {
        setChannelInfo(ch);
      })

      getYoutubePlaylists().then(pls => setPlaylists(pls))
    }
  }, [isLoggedIn]);


  const videos = [
    { id: '1', thumbnail: 'https://via.placeholder.com/150' },
    { id: '2', thumbnail: 'https://via.placeholder.com/150' }
  ];

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideos(prevSelected =>
      prevSelected.includes(videoId)
        ? prevSelected.filter(id => id !== videoId)
        : [...prevSelected, videoId]
    );
  };

  const handleUpload = () => {
    console.log('Uploading videos:', selectedVideos);
  };

  const handleLogin = async () => {
    try {
      await youtubeAuthorize();
    } catch (error) {
      setIsLoggedIn(false)
    }
  }

  return (
    <div>
      {channelInfo && <Card sx={{ display: 'flex' }}>
        <CardMedia image={channelInfo.thumbnails?.default?.url || ''}
          sx={{ minWidth: `${channelInfo.thumbnails?.default?.width || 0}px`, height: `${channelInfo.thumbnails?.default?.height || 0}px` }} />
        <CardContent>
          <Typography variant="h5">{channelInfo.title}</Typography>
          <Typography variant="body2">{channelInfo.description}</Typography>
        </CardContent>
      </Card>}

      <Button variant="contained" color="primary" style={{ margin: '20px 0' }} onClick={() => handleLogin()}>
        Login / switch Youtube channel
      </Button>

      <Typography variant="h6">Playlists</Typography>
      <Grid2 container spacing={2}>
        {playlists.map(playlist => <Grid2 key={playlist.id} size={{ xs: 2, sm: 4, md: 4 }}>
          <div>{playlist?.title || ''}</div>
          <img src={playlist?.thumbnails.default?.url || ''} alt="Playlist Thumbnail" />
        </Grid2>
        )}
      </Grid2>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Videos</Typography>
      <Grid2 container spacing={2}>
        {videos.map(video => (
          <Grid2 key={video.id}>
            <Checkbox
              checked={selectedVideos.includes(video.id)}
              onChange={() => handleVideoSelect(video.id)}
            />
            <img src={video.thumbnail} alt="Video Thumbnail" />
          </Grid2>
        ))}
      </Grid2>

      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={handleUpload}
        disabled={selectedVideos.length === 0}
      >
        Start Upload
      </Button>
    </div>
  );
};

export default YoutubeHome;
