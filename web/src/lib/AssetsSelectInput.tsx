import React, { useEffect, useState } from 'react';

import AssetsManager from './AssetsManager';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Asset } from '../Services/AssetsManager.interface';

interface AssetsSelectInputProps {
  label?: string;
  name?: string;
  value?: string[];
  singleSelect?: boolean;
  onChange?: (assetUrls: string[] | string) => void;
  assetType?: 'images' | 'music' | 'videos';
}

const toAssets = (strAssets: string[]): Asset[] => {
  return strAssets?.filter(s => s).map(str => ({
    filename: str.substring(str.indexOf('/') + 1),
    parentPath: str.substring(0, str.indexOf('/')), // eg images or music or videos
    ext: str.split('.').pop(),  // File extension
    name: str.substring(str.indexOf('/') + 1, str.lastIndexOf('.')),
  } as Asset)) || [];
}

const fromAssets = (assetItems: Asset[]): string[] => {
  return assetItems?.map(ast => `${ast.parentPath}/${ast.filename}`) || [];
}

const AssetsSelectInput: React.FC<AssetsSelectInputProps> = ({ label, name, value, assetType, singleSelect, onChange }) => {
  const [assets, setAssets] = useState<Asset[]>(toAssets(value || []));
  const [strAssets, setStrAssets] = useState<string[]>(value || []);
  const [assetsManagerOpen, setAssetsManagerOpen] = useState(false);

  useEffect(() => {
    onChange && onChange(singleSelect ? strAssets[0] : strAssets);
  }, [strAssets])

  const handleAssetsChange = (assets: Asset[]) => {
    setAssets(assets);
    setStrAssets(fromAssets(assets));
    setAssetsManagerOpen(false)
  }

  return (
    <>
      <Box style={{ marginTop: '1em', display: 'flex', flexDirection: 'row', width: '100%' }}>
        <TextField
          label={label}
          name={name}
          value={singleSelect ? strAssets[0] || '' : strAssets?.join(',')}
          fullWidth
          aria-readonly
        />
        <Button onClick={() => setAssetsManagerOpen(true)} variant="contained" component="span" startIcon={<CloudUploadIcon />}></Button>
      </Box>
      <Dialog open={assetsManagerOpen} onClose={() => setAssetsManagerOpen(false)} fullScreen>
        <DialogTitle>Assets Manager</DialogTitle>
        <DialogContent>
          <AssetsManager selected={assets} assetType={assetType} onChange={handleAssetsChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssetsManagerOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssetsSelectInput;
