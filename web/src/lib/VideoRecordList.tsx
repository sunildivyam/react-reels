import React, { useState } from 'react';
import { List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { VideoRecord } from '../Services/Composition.interface';


interface VideoRecordListProps {
  records: VideoRecord[];
}

const VideoRecordList: React.FC<VideoRecordListProps> = ({ records }) => {
  const [filter, setFilter] = useState<string>('');


  const filteredRecords = records.filter(record => record
    // (record.compositionInfo.defaultProps as any).title.toLowerCase().includes(filter.toLowerCase()) ||
    // (record.outFileName && record.outFileName.toLowerCase().includes(filter.toLowerCase())) ||
    // (record.renderedOn && record.renderedOn.toDateString().toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div>
      <Typography variant="h6">Video Record List</Typography>
      <TextField
        label="Filter"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <List>
        {filteredRecords.map((record: VideoRecord) => {
          const { id, outFileName, renderedOn, compositionInfo } = record;
          const { title, summary } = (compositionInfo.defaultProps || {}) as any;

          return <ListItem key={record.id}>
            <ListItemText
              primary={<>
                <Typography variant="h5">{title || id}</Typography>
                {summary && <Typography variant="h6">{summary}</Typography>}
              </>
              }
              secondary={`Rendered File: ${outFileName || 'pending'} | Rendered On: ${renderedOn || 'pending'}`}
            />
          </ListItem>
        })}
      </List>
    </div>
  );
};

export default VideoRecordList;
