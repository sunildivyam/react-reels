import React, { useEffect, useState } from 'react';
import { Button, } from '@mui/material';
import { ChannelInfo, VideoPlaylist, VideoUpload } from '../Services/youtube.interface';
import { getYoutubeChannel, getYoutubePlaylists, youtubeAuthorize, youtubeAuthorized } from '../Services/Youtube.service';
import YoutubeChannel from './YoutubeChannel';
import VideoSelectList from './VideosSelectList';
import PlaylistsSelectList from './PlaylistsSelectList';

const YoutubeHome: React.FC = () => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
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


  const uploadVideos: Partial<VideoUpload>[] = [
    { id: '1', title: 'Hello world video 1' },
    { id: '2', title: 'Hello world video 2' }
  ];

  const handlePlaylistSelect = (playlistIds: Array<string>) => {
    setSelectedPlaylists(playlistIds);
  };

  const handleVideoSelect = (videoIds: Array<string>) => {
    setSelectedVideos(videoIds);
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
      <Button variant="contained" color="primary" style={{ margin: '20px 0' }} onClick={() => handleLogin()}>
        Login / switch Youtube channel
      </Button>
      {channelInfo && <YoutubeChannel channelInfo={channelInfo} />}
      <PlaylistsSelectList title='PLAYLISTS' playlists={playlists} onSelect={handlePlaylistSelect} />
      <VideoSelectList title='UPLOAD READY VIDEOS' videos={uploadVideos} onSelect={handleVideoSelect} />
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={handleUpload}
        disabled={selectedVideos.length === 0 || selectedPlaylists.length === 0}
      >
        Start Upload
      </Button>
    </div>
  );
};

export default YoutubeHome;
