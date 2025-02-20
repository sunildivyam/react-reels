import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { socket, SocketEventsEnums } from '../Services/Sockets';
import { VideoRecord } from '../Services/Composition.interface';

const RenderProgress: React.FC = () => {
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressHistory, setProgressHistory] = useState<string>('');
  const [batchProgress, setBatchProgress] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<VideoRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    socket.on(SocketEventsEnums.RENDER_START, (e) => {
      setCurrentVideo(null);
      setBatchProgress(0);
      setVideoCount(e.count);
      setProgressHistory('');
      setErrorMessage('');
      setCurrentCount(0);
    });

    socket.on(SocketEventsEnums.RENDER_PROGRESS, (e) => {
      setVideoCount(e.count);
      setBatchProgress(Math.floor((e.current - 1) / e.count * 100));
    });

    socket.on(SocketEventsEnums.RENDER_FINISHED, () => {
      setBatchProgress(100);
    });

    socket.on(SocketEventsEnums.COMPOSITION_START, (e) => {
      setCurrentVideo(e);
      setCurrentCount(prev => prev + 1);
    });

    socket.on(SocketEventsEnums.COMPOSITION_PROGRESS, (e) => {
      setProgressMsg(e);
    });

    socket.on(SocketEventsEnums.COMPOSITION_FINISHED, () => {
      setProgressHistory(prev => `${prev}\n${currentVideo?.id || ''}\n${currentVideo?.outFileName || ''}\n${progressMsg}`);
      setErrorMessage('');
    });

    socket.on(SocketEventsEnums.RENDER_FAILED, (e) => {
      setErrorMessage(e);
      setProgressHistory(prev => `${prev}\n${e}`)
    });
    socket.on(SocketEventsEnums.COMPOSITION_FAILED, (e) => {
      setErrorMessage(e);
      setProgressHistory(prev => `${prev}\n${e}`)
    });
  }, [])

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          Rendering ({currentCount}/{videoCount})
        </Typography>
        <LinearProgress variant="determinate" value={batchProgress} />
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body1">{`${Math.round(batchProgress)}%`}</Typography>
        </Box>
      </Box>
      <Box justifyContent={'center'}>
        <Typography variant="h6" gutterBottom>
          {currentVideo?.id} | {currentVideo?.outFileName}
        </Typography>
        <Box display="flex" justifyContent="start" flexDirection="column" mt={2}>
          {
            progressMsg.split('\n').map(line => <Typography variant="body1" component={'p'}>{line}</Typography>)
          }
        </Box>
      </Box>
      {errorMessage && <Box justifyContent={'center'}>
        <Typography variant="h6" gutterBottom style={{ color: 'red' }}>
          {errorMessage}
        </Typography>
      </Box>}
      {progressHistory && <Box justifyContent={'center'} mt={2}>
        <Typography variant="h6" gutterBottom>
          Progress History
        </Typography>
        <textarea
          readOnly
          value={progressHistory}
          rows={10}
          style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
        />
      </Box>}
    </>
  );
};

export default RenderProgress;
