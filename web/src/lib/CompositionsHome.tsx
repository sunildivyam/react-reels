import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import VideoRecordList from './VideoRecordList';
import { VideoRecord } from '../Services/Composition.interface';
import { addDatabase, getCompositionAll, listDatabases } from '../Services/Composition.service';
// import { dbNames } from '../config';
import { VideoEngineDataContext } from './VideoEngineDataProvider';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const CompositionsHome: React.FC = () => {
  const [dbNames, setDbNames] = useState<string[]>([]);
  const { videoEngineData, updateVideoEngineData } = useContext(VideoEngineDataContext);
  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>(videoEngineData?.videoRecords || []);
  const [dbName, setDbName] = useState<string>(videoEngineData?.dbName || '');
  const [open, setOpen] = useState(false);
  const [newDbName, setNewDbName] = useState('');

  useEffect(() => {
    if (!dbNames?.length) {
      listDatabases().then(dbs => setDbNames(dbs))
    }
  }, []);

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

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleCreate = () => {
    addDatabase(newDbName).then(nDbName => {
      setVideoRecords([]);
      setDbNames(prev => [...prev, nDbName]);
      setDbName(nDbName);
      handleClose();
    });
  };

  const handleDbSelect = (e: any) => {
    const dbName = e.target.value as string;
    if (dbName === '<<Add New database>>') {
      handleOpen();
    } else {
      // reset VideoRecords
      setVideoRecords([]);
      setDbName(dbName);
    }
  }

  return (<>
    <Container>
      <Typography style={{ textAlign: 'center' }} variant="h4" component="h1" gutterBottom>
        Compositions Home
      </Typography>

      <FormControl fullWidth></FormControl>
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
          <MenuItem key={'add-new'} value={'<<Add New database>>'}>
            {'<<Add New database>>'}
          </MenuItem>
        </Select>
      </FormControl>
      <VideoRecordList title='Video records' records={videoEngineData?.videoRecords || []} />
    </Container>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Database</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Database Name"
          type="text"
          fullWidth
          value={newDbName}
          onChange={(e) => setNewDbName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  </>);
};

export default CompositionsHome;
