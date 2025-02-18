import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { socket, SocketEventsEnums } from '../Services/Sockets';
import { VideoUpload } from '../Services/youtube.interface';

const UploadProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [batchProgress, setBatchProgress] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<VideoUpload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_START, (e) => {
      setBatchProgress(0);
      setVideoCount(e.videoUploads.length);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_PROGRESS, (e) => {
      setBatchProgress(e.progress);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_BATCH_FINISH, () => {
      setBatchProgress(100);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_START, (e) => {
      setCurrentVideo(e.videoUpload);
      setCurrentCount(prev => prev + 1);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_PROGRESS, (e) => {
      setProgress(e.progress);
    });

    socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_FINISH, () => {
      setProgress(100);
    });
  }, [])


  socket.on(SocketEventsEnums.YOUTUBE_UPLOAD_FAILED, (e) => {
    setErrorMessage(e.message);
  });


  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          Batch Started ({currentCount}/{videoCount})
        </Typography>
        <LinearProgress variant="determinate" value={batchProgress} />
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body1">{`${Math.round(batchProgress)}%`}</Typography>
        </Box>
      </Box>
      <Box justifyContent={'center'}>
        <Typography variant="h6" gutterBottom>
          {currentVideo?.id} | {currentVideo?.title}
        </Typography>
        <LinearProgress variant="determinate" value={progress} />
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body1">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
      <Box justifyContent={'center'}>
        <Typography variant="h6" gutterBottom>
          {errorMessage}
        </Typography>
      </Box>
    </>
  );
};

export default UploadProgress;
