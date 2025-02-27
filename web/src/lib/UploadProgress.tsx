import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { socket, SocketEventsEnums } from '../Services/Sockets';
import { YoutubeUploadProgress } from '../Services/youtube.interface';
import { formatDuration } from '../Utils/utils';

const UploadProgress: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<YoutubeUploadProgress>();

  useEffect(() => {
    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_START, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_PROGRESS, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_FINISH, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_FAILED, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_START, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_PROGRESS, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_FINISH, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_FAILED, (e: YoutubeUploadProgress) => {
      setUploadProgress(e);
    });
  }, [])

  const {
    dbName,
    timeStartedMS,
    timeEllapsedMS,
    progress,
    currentItem,
    currentItemNo,
    totalItems,
    error } = uploadProgress || {};

  const { videoUpload, progress: vProgress, error: vError } = currentItem || {};

  if (!totalItems) return null;
  return (
    <>
      <Box>
        {timeStartedMS && <Typography variant="h6" gutterBottom>
          Started at:  {(new Date(timeStartedMS)).toTimeString()}
        </Typography>}
        <Typography variant="h6" gutterBottom>
          Uploading ({currentItemNo}/{totalItems}) of {dbName} | Time Ellapsed: {formatDuration(timeEllapsedMS || 0)}
        </Typography>
        <LinearProgress variant="determinate" value={progress} />
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body1">{`${progress}%`}</Typography>
        </Box>
      </Box>
      <Box justifyContent={'center'}>
        <Typography variant="h6" gutterBottom>
          {videoUpload?.id} | {videoUpload?.title}
        </Typography>
        <LinearProgress variant="determinate" value={vProgress} />
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body1">{`${vProgress}%`}</Typography>
        </Box>
      </Box>
      {vError && <Box justifyContent={'center'}>
        <Typography variant="h6" gutterBottom color='error'>
          {vError}
        </Typography>
      </Box>}
      {error && <Box justifyContent={'center'}>
        <Typography variant="h6" gutterBottom color='error'>
          {error}
        </Typography>
      </Box>}
    </>
  );
};

export default UploadProgress;
