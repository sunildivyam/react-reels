import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import VideoRecordList from './VideoRecordList';
import { VideoRecord } from '../Services/Composition.interface';
import { getCompositionAll } from '../Services/Composition.service';
import { dbNames } from '../config';
import { VideoEngineDataContext } from './VideoEngineDataProvider';

const CompositionsHome: React.FC = () => {
  const { videoEngineData, updateVideoEngineData } = useContext(VideoEngineDataContext);
  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>(videoEngineData?.videoRecords || []);
  const [dbName, setDbName] = useState<string>(videoEngineData?.dbName || '');

  useEffect(() => {
    if (dbName && !videoRecords?.length) {
      getCompositionAll(dbName).then(vRecords => setVideoRecords(vRecords));
      updateVideoEngineData && updateVideoEngineData({
        dbName
      });
    }
  }, [dbName]);

  useEffect(() => {
    if (videoRecords) {
      updateVideoEngineData && updateVideoEngineData({
        videoRecords
      });
    }
  }, [videoRecords]);

  const handleDbSelect = (e: any) => {
    // reset VideoRecords
    setVideoRecords([]);
    setDbName(e.target.value as string)
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Video Compositions
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="dbName-select-label">Database Name</InputLabel>
        <Select
          labelId="dbName-select-label"
          value={dbName}
          label="Database Name"
          onChange={handleDbSelect}
        >
          {dbNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <VideoRecordList records={videoEngineData?.videoRecords || []} />
    </Container>
  );
};

export default CompositionsHome;
