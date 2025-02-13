import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, } from '@mui/material';
import { ChannelInfo, VideoMeta, VideoPlaylist, VideoUpload } from '../Services/youtube.interface';
import { getYoutubeChannel, getYoutubePlaylists, prepareUploadReadyVideos, uploadVideos, youtubeAuthorize, youtubeAuthorized } from '../Services/Youtube.service';
import YoutubeChannel from './YoutubeChannel';
import VideoSelectList from './VideosSelectList';
import PlaylistsSelectList from './PlaylistsSelectList';
import { VideoEngineDataContext } from './VideoEngineDataProvider';
import VideoMetaForm from './VideoMetaForm';
import UploadProgress from './UploadProgress';
import { socket, SocketEventsEnums } from '../Services/Sockets';

const YoutubeHome: React.FC = () => {
  const { videoEngineData, updateVideoEngineData } = useContext(VideoEngineDataContext);
  const [uploadReadyVideos, setUploadReadyVideos] = useState<VideoUpload[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [playlists, setPlaylists] = useState<Array<VideoPlaylist>>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | undefined>(videoEngineData?.videoMeta);
  const [uploadStarted, setUploadStarted] = useState<boolean>(false);

  socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_FINISH, () => {
    setUploadStarted(false);
  });

  socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_FAILED, () => {
    setUploadStarted(false);
  });

  useEffect(() => {
    videoEngineData?.videoRecords && setUploadReadyVideos(
      prepareUploadReadyVideos(videoEngineData.videoRecords,
        selectedPlaylists,
        videoMeta));
  }, [videoEngineData, selectedPlaylists, videoMeta])

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

  const handlePlaylistSelect = (playlistIds: Array<string>) => {
    setSelectedPlaylists(playlistIds);
  };

  const handleVideoSelect = (videoIds: Array<string>) => {
    setSelectedVideos(videoIds);
  };

  const handleUpload = () => {
    const videosToUpload = uploadReadyVideos.filter(v => selectedVideos.includes(v.id));
    videoEngineData?.dbName && videosToUpload?.length && uploadVideos(videoEngineData?.dbName,videosToUpload).then(() => setUploadStarted(true));
  };

  const handleLogin = async () => {
    try {
      await youtubeAuthorize();
    } catch (error) {
      setIsLoggedIn(false)
    }
  }

  const handleMetaChange = (meta: VideoMeta) => {
    setVideoMeta(meta);
    updateVideoEngineData && updateVideoEngineData({
      videoMeta: meta
    })
  }

  return (
    <div>
      <Box>{uploadStarted}</Box>
      <UploadProgress />
      <Box fontStyle={{ textAlign: 'center' }}> <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={handleUpload}
        disabled={selectedVideos.length === 0 || selectedPlaylists.length === 0 || uploadStarted}
      >
        Start Upload
      </Button></Box>
      <Button variant="contained" color="primary" style={{ margin: '20px 0' }} onClick={() => handleLogin()}>
        Login / switch Youtube channel
      </Button>
      {channelInfo && <YoutubeChannel channelInfo={channelInfo} />}
      <VideoMetaForm meta={videoMeta} onChange={handleMetaChange} />
      <PlaylistsSelectList title='PLAYLISTS' playlists={playlists} onSelect={handlePlaylistSelect} />
      <VideoSelectList title='UPLOAD READY VIDEOS' videos={uploadReadyVideos} onSelect={handleVideoSelect} />
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={handleUpload}
        disabled={selectedVideos.length === 0 || selectedPlaylists.length === 0 || uploadStarted}
      >
        Start Upload
      </Button>
    </div>
  );
};

export default YoutubeHome;
