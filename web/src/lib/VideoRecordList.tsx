import React, { useContext, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Grid2, Typography } from '@mui/material';
import { CompositionInfo, VideoRecord } from '../Services/Composition.interface';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CompositionInfoForm from './CompositionInfoForm';
import { addVideoRecord, addVideoRecords, deleteVideoRecord, updateVideoRecord } from '../Services/Composition.service';
import { VideoEngineDataContext } from './VideoEngineDataProvider';
import AiQuotesForm from './AiQuotesForm';
import VideoRecordItem from './VideoRecordItem';
import { DEFAULT_COMPSITION_INFO, DEFAULT_COMPSITION_PROPS } from '../Services/Composition.constants';

interface VideoRecordListProps {
  title: string;
  records: VideoRecord[];
  onSelect?: (videoRecords: VideoRecord[]) => void;
}

const VideoRecordList: React.FC<VideoRecordListProps> = ({ records, onSelect, title }) => {
  const { videoEngineData, updateVideoEngineData } = useContext(VideoEngineDataContext);
  const [selectedVideoRecords, setSelectedVideoRecords] = useState<VideoRecord[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [aiOpen, setAiOpen] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<VideoRecord | null>(null);

  const handleEditClick = (record: VideoRecord) => {
    setCurrentRecord(record);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (record: VideoRecord) => {
    await deleteVideoRecord(videoEngineData?.dbName || '', record);
    records = records.filter(rec => rec.id !== record.id);
    updateVideoEngineData && updateVideoEngineData({ videoRecords: [...records] })
    setCurrentRecord(null);
  };

  const handleAddClick = async () => {
    const record: VideoRecord = {
      id: '',
      compositionInfo: {
        ...DEFAULT_COMPSITION_INFO,
        defaultProps: {
          ...DEFAULT_COMPSITION_PROPS,
          name: 'Sample Name',
          title: 'Sample title',
          summary: 'Sample Summary',
        }
      },
      outFileName: '',
      socialMedia: {}
    }
    const added = await addVideoRecord(videoEngineData?.dbName || '', record);
    records.splice(0, 0, added);
    updateVideoEngineData && updateVideoEngineData({ videoRecords: [...records] });
  };

  const handleDuplicateClick = async (record: VideoRecord) => {
    const duplicate: VideoRecord = { ...record, id: '', renderedOn: undefined, outFileName: '', youTube: { ...record.youTube, uploadedOn: undefined, videoId: '' } };
    const added = await addVideoRecord(videoEngineData?.dbName || '', duplicate);
    const index = records.findIndex(rec => rec.id === record.id);
    records.splice(index + 1, 0, added);
    updateVideoEngineData && updateVideoEngineData({ videoRecords: [...records] });
  };

  const handleSaveDialog = () => {
    if (currentRecord) {
      updateVideoRecord(videoEngineData?.dbName || '', currentRecord).then((rec: VideoRecord) => {
        records.forEach(r => {
          if (r.id === rec.id) {
            r.compositionInfo = rec.compositionInfo
          }
        })

        setOpenDialog(false);
        setCurrentRecord(null);
        updateVideoEngineData && updateVideoEngineData({ videoRecords: [...records] })
      })
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRecord(null);
  };

  const handleCompositionInfoChange = (cmpInfo: CompositionInfo) => {
    // Update the record in the list (you might need to lift state up to parent component)
    // setOpenDialog(false);
    setCurrentRecord(prev => {
      if (prev) {
        return {
          ...prev,
          compositionInfo: { ...prev.compositionInfo, ...cmpInfo }
        }
      }
      return null;
    });
  };


  useEffect(() => {
    onSelect && onSelect(selectedVideoRecords);
  }, [selectedVideoRecords]);

  useEffect(() => {
    const selecteVs = allSelected ? records : [];
    setSelectedVideoRecords(selecteVs);
  }, [allSelected]);

  const handleVideoSelect = (vRecord: VideoRecord) => {
    setSelectedVideoRecords(prevSelected =>
      prevSelected.includes(vRecord)
        ? prevSelected.filter(vR => vR.id !== vRecord.id)
        : [...prevSelected, vRecord]
    );
  };

  const handleSelectAll = () => setAllSelected(prev => !prev);

  const handleRandomSelect = (e: any) => {
    const count = parseInt(e.target.value, 10);
    if (count === records.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
      const randomVideos = records
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
      setSelectedVideoRecords(randomVideos);
    }
  };

  const handleAiQuoteChange = async (vRecords: VideoRecord[]) => {
    const added = await addVideoRecords(videoEngineData?.dbName || '', vRecords);
    records.splice(0, 0, ...added);
    updateVideoEngineData && updateVideoEngineData({ videoRecords: [...records] });
  }

  return (
    <>
      <Box style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h5">{title} ({selectedVideoRecords.length}/{records.length})</Typography>
      </Box>
      <Box style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'right' }}>
        <Checkbox style={{ marginRight: '10px' }} checked={allSelected} onChange={handleSelectAll} title='Select all' />
        <FormControlLabel
          control={
            <select onChange={handleRandomSelect} style={{ padding: '10px' }}>
              <option value="">Select Randomly</option>
              {[10, 30, 50, 70, 100, 200, records.length].map((count) => (
                <option key={count} value={count}>
                  {count === records.length ? `${count} (All)` : count}
                </option>
              ))}
            </select>
          }
          label=""
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                const isChecked = e.target.checked;
                setSelectedVideoRecords(records.filter(record => isChecked ? !!record.renderedOn : !record.renderedOn));
              }}
            />
          }
          label="Rendered"
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                const isChecked = e.target.checked;
                setSelectedVideoRecords(records.filter(record => isChecked ? !!record.youTube?.uploadedOn : !record.youTube?.uploadedOn));
              }}
            />
          }
          label="Uploaded"
        />
        <Button style={{ margin: '1em' }} variant="outlined" onClick={() => handleAddClick()}>
          Add New
        </Button>
        <Button style={{ margin: '1em' }} variant="outlined" onClick={() => setAiOpen(true)}>
          Generate New
        </Button>
      </Box>

      <Grid2 container spacing={2}>
        {records.map((record: VideoRecord) => {
          const { id } = record;

          return <Grid2 key={id} style={{ backgroundColor: '#e9e9e9', borderRadius: '0.5em', padding: '1em', width: '100%' }}>
            <FormControlLabel control={<Checkbox
              checked={selectedVideoRecords.includes(record)}
              onChange={() => handleVideoSelect(record)}
            />} label={<VideoRecordItem value={record} />} />

            <Box style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: '1em'
            }}>
              <Button variant="outlined" onClick={() => handleEditClick(record)}>
                Edit
              </Button>
              <Button variant="outlined" onClick={() => handleDuplicateClick(record)}>
                Duplicate
              </Button>
              <Button variant="outlined" onClick={() => handleDeleteClick(record)}>
                Delete
              </Button>
            </Box>
          </Grid2>
        })}
      </Grid2>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Composition Info</DialogTitle>
        <DialogContent>
          {currentRecord && (
            <CompositionInfoForm
              initialData={currentRecord.compositionInfo}
              onChange={handleCompositionInfoChange}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialog} color="primary">
            Save
          </Button>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={aiOpen} onClose={() => setAiOpen(false)}>
        <DialogTitle>Quotes gGenerator</DialogTitle>
        <DialogContent>
          <AiQuotesForm onChange={handleAiQuoteChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VideoRecordList;
