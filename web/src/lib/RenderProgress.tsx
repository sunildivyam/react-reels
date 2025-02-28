import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { socket, SocketEventsEnums } from '../Services/Sockets';
import { RenderProgressType } from '../Services/Render.interface';
import { CircularProgress } from '@mui/material';
import { formatDuration } from '../Utils/utils';
import { endpoints } from '../Services/Render.service';

const RenderProgress: React.FC = () => {
  const [renderProgress, setRenderProgress] = useState<RenderProgressType>();
  const [finished, setFinished] = useState<boolean>();

  useEffect(() => {
    socket.on(SocketEventsEnums.RENDER_START, (e: RenderProgressType) => {
      setRenderProgress(e);
      setFinished(false);
    });

    socket.on(SocketEventsEnums.RENDER_PROGRESS, (e: RenderProgressType) => {
      setRenderProgress(e);
    });

    socket.on(SocketEventsEnums.RENDER_FINISH, (e: RenderProgressType) => {
      setRenderProgress(e);
      setFinished(true);
    });

    socket.on(SocketEventsEnums.RENDER_FAILED, (e: RenderProgressType) => {
      setRenderProgress(e);
      setFinished(true);
    });

    socket.on(SocketEventsEnums.COMPOSITION_START, (e: RenderProgressType) => {
      setRenderProgress(e);
    });

    socket.on(SocketEventsEnums.COMPOSITION_PROGRESS, (e: RenderProgressType) => {
      setRenderProgress(e);
    });

    socket.on(SocketEventsEnums.COMPOSITION_FINISH, (e: RenderProgressType) => {
      setRenderProgress(e);
    });

    socket.on(SocketEventsEnums.COMPOSITION_FAILED, (e: RenderProgressType) => {
      setRenderProgress(e);
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
    history,
    renderedVideoUrls,
    error } = renderProgress || {};

  const {
    videoRecord,
    message,
  } = currentItem || {};

  if (!totalItems) return null;

  return (<>
    <Box textAlign={'center'}>
      {timeStartedMS && <Typography variant="h6" gutterBottom>
        Started at:  {(new Date(timeStartedMS)).toTimeString()}
      </Typography>}
      <Typography variant="h6" gutterBottom>
        {finished === true ? 'Finished' : 'Rendering'} ({currentItemNo}/{totalItems}) of {dbName} | Time Ellapsed: {formatDuration(timeEllapsedMS || 0)}
      </Typography>
      {finished === false && <CircularProgress color='primary' variant="indeterminate" size={'5em'} />}
      <LinearProgress variant="determinate" value={progress} />
      <Box display="flex" justifyContent="center" mt={2}>
        <Typography variant="body1">{`${progress}%`}</Typography>
      </Box>
    </Box>
    <Box justifyContent={'center'}>
      <Typography variant="h6" gutterBottom>
        {videoRecord?.id} | {videoRecord?.outFileName}
      </Typography>
      <Box display="flex" justifyContent="start" alignItems={'center'} flexDirection="row" mt={2} flexWrap={'wrap'}>
        <Box style={{margin: '1em'}}>
          <CircularProgress color='primary' value={currentItem?.progress?.progress || 1} variant="determinate" size={'5em'} />
        </Box>
        <Box display="flex" justifyContent="start" flexDirection="column" mt={2}>
          {
            message && message.split('\n').map(line => <Typography variant="body1" component={'p'}>{line}</Typography>)
          }
        </Box>
        {currentItem?.error && <Box justifyContent={'center'}>
          <Typography variant="h6" gutterBottom style={{ color: 'red' }}>
            {currentItem.error}
          </Typography>
        </Box>}
      </Box>
    </Box>
    {error && <Box justifyContent={'center'}>
      <Typography variant="h6" gutterBottom style={{ color: 'red' }}>
        {error}
      </Typography>
    </Box>}
    {(renderedVideoUrls && renderedVideoUrls.length > 0) && <Box display="flex" justifyContent="start" flexDirection="row" mt={2} flexWrap={'wrap'} maxHeight={'40em'} overflow={'auto'}>
      {renderedVideoUrls.map((url: string) => {
        const src = `${endpoints.outVideos}/${url}`;
        return <video key={src} controls style={{ maxWidth: '15em', maxHeight: '15em', margin: '1em' }}>
          <source src={src} type="video/mp4" />
          Your browser does not support the video element.
        </video>
      })}
    </Box>}
    {(history && history.length > 0) && <Box justifyContent={'center'} mt={2}>
      <Typography variant="h6" gutterBottom>
        Progress History
      </Typography>
      <textarea
        readOnly
        value={history.join('\n')}
        rows={10}
        style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
      />
    </Box>}

  </>
  );
};

export default RenderProgress;
