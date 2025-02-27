import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { VideoRecord } from '../Services/Composition.interface';
import { VideoEngineDataContext } from './VideoEngineDataProvider';
import { prepareRenderReadyVideos, renderVideoRecords } from '../Services/Render.service';
import VideoRecordList from './VideoRecordList';
import RenderProgress from './RenderProgress';
import { getCompositionAll } from '../Services/Composition.service';
import { socket, SocketEventsEnums } from '../Services/Sockets';


const RenderHome: React.FC = () => {
  const { videoEngineData, updateVideoEngineData } = useContext(VideoEngineDataContext);
  const [uploadReadyVideos, setUploadReadyVideos] = useState<VideoRecord[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<VideoRecord[]>([]);


  const reloadDb = () => {
    videoEngineData?.dbName && getCompositionAll(videoEngineData?.dbName)
      .then(vRecords => updateVideoEngineData && updateVideoEngineData({
        videoRecords: vRecords
      }))
  }

  socket.on(SocketEventsEnums.COMPOSITION_FINISH, () => {
    reloadDb();
    setSelectedVideos([])
  });

  useEffect(() => {
    videoEngineData?.videoRecords && setUploadReadyVideos(
      prepareRenderReadyVideos(videoEngineData.videoRecords));
  }, [videoEngineData])

  const handleStartRendering = () => {
    if (videoEngineData?.dbName && selectedVideos?.length) {
      renderVideoRecords(videoEngineData?.dbName, selectedVideos);
    }
  };

  const handleVideoRecordsSelect = (vRecords: VideoRecord[]) => {
    setSelectedVideos(vRecords);
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography style={{ textAlign: 'center' }} variant="h4">Rendering Home</Typography>
      <RenderProgress />
      <Button style={{ margin: '1em' }} variant="contained" color="primary" onClick={handleStartRendering} disabled={!selectedVideos?.length}>
        Start Rendering
      </Button>
      <VideoRecordList title={'Ready to Render Video Records'} records={uploadReadyVideos} onSelect={handleVideoRecordsSelect} />
      <Button style={{ margin: '1em' }} variant="contained" color="primary" onClick={handleStartRendering} disabled={!selectedVideos?.length}>
        Start Rendering
      </Button>
    </Box>
  );
};

export default RenderHome;
