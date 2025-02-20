import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { VideoRecord } from '../Services/Composition.interface';
import { VideoEngineDataContext } from './VideoEngineDataProvider';
import { prepareRenderReadyVideos, renderVideoRecords } from '../Services/Render.service';
import VideoRecordList from './VideoRecordList';
import RenderProgress from './RenderProgress';


const RenderHome: React.FC = () => {
  const { videoEngineData } = useContext(VideoEngineDataContext);
  const [uploadReadyVideos, setUploadReadyVideos] = useState<VideoRecord[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<VideoRecord[]>([]);

  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    videoEngineData?.videoRecords && setUploadReadyVideos(
      prepareRenderReadyVideos(videoEngineData.videoRecords));
  }, [videoEngineData])

  const handleStartRendering = () => {
    if (videoEngineData?.dbName && selectedVideos?.length) {
      renderVideoRecords(videoEngineData?.dbName, selectedVideos).then((res: any) => {
        res.started && setIsRendering(true);
      })
    }
  };

  const handleVideoRecordsSelect = (vRecords: VideoRecord[]) => {
    setSelectedVideos(vRecords);
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography style={{ textAlign: 'center' }} variant="h4">Rendering Home</Typography>
      <RenderProgress />
      <Button style={{ margin: '1em' }} variant="contained" color="primary" onClick={handleStartRendering} disabled={isRendering || !selectedVideos?.length}>
        Start Rendering
      </Button>
      <VideoRecordList title={'Ready to Render Video Records'} records={uploadReadyVideos} onSelect={handleVideoRecordsSelect} />
      <Button style={{ margin: '1em' }} variant="contained" color="primary" onClick={handleStartRendering} disabled={isRendering || !selectedVideos?.length}>
        Start Rendering
      </Button>
    </Box>
  );
};

export default RenderHome;
