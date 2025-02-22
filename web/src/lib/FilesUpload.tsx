import React, { useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { uploadAssets } from '../Services/AssetsManager.service';
import { AxiosProgressEvent } from 'axios';
import { UploadAssetsResult } from '../Services/AssetsManager.interface';

const Input = styled('input')({
  display: 'none',
});

interface FilesUploadProps {
  multiple?: boolean;
  allowedExtensions?: string[];
  onChange: (uploadResult: UploadAssetsResult[]) => void;
}

const FilesUpload: React.FC<FilesUploadProps> = ({ multiple = false, allowedExtensions = [], onChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  const [progress, setProgress] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    uploadFiles(selectedFiles);
  };

  const uploadFiles = async (files: File[]) => {
    setOpen(true);
    setStarted(true);
    setProgress(0);
    setUploadError('');
    const progressArray = new Array(files.length).fill(0);
    setUploadProgress(progressArray);

    const uploadResult: UploadAssetsResult[] | undefined = await uploadAssets(files, (progressEvent: AxiosProgressEvent) => {
      setProgress((progressEvent.progress || 0) * 100);
    }).catch(error => {
      console.log(error);
      setStarted(false);
      setUploadError(error.message);
      return [];
    });
    setStarted(false);
    onChange(uploadResult || []);
  };

  return (
    <Box>
      <label htmlFor="file-upload">
        <Input
          id="file-upload"
          type="file"
          multiple={multiple}
          accept={allowedExtensions.join(',')}
          onChange={handleFileChange}
        />
        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
          Upload Files
        </Button>
      </label>
      <Dialog
        open={open}
        onClose={() => { }}
        disableEscapeKeyDown
        aria-labelledby="upload-progress-dialog"
        aria-describedby="upload-progress-description"
      >
        <DialogTitle>
          Upload Progress
        </DialogTitle>
        <DialogContent>
          <Box style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            padding: '20px'
          }}>
            <CircularProgress value={progress} color={uploadError ? 'error' : 'primary'} variant='determinate' size={'10em'} />
            {uploadError && <Typography color='error'>{uploadError}</Typography>}
            {files.map((file, index) => (
              <Box key={file.name} mt={2}>
                <Typography variant="body2">{index + 1}: {file.name}</Typography>
                <LinearProgress variant="determinate" value={uploadProgress[index]} />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          {!started && <Button color='secondary' onClick={() => { setOpen(false); setFiles([]) }}>Close</Button>}
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default FilesUpload;
