import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab, Box, ListItem, ListItemIcon, ListItemText, TextField, IconButton, Button, Checkbox } from '@mui/material';
import { Audiotrack, Delete, VideoCameraFront } from '@mui/icons-material';
import { Asset } from '../Services/AssetsManager.interface';
import { deleteAssets, endpoints, listAssets } from '../Services/AssetsManager.service';
import FilesUpload from './FilesUpload';
import { ALLOWED_EXTENSIONS, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_MUSIC_EXTENSIONS, ALLOWED_VIDEO_EXTENSIONS } from '../config';
import AssetsSlideShow from './AssetsSlideShow';

interface AssetsManagerProps {
  assetType?: 'images' | 'videos' | 'music';
  selected?: Asset[];
  onChange?: (selectedAssets: Asset[]) => void;
}
const TABS = ['all', 'images', 'music', 'videos'];

const AssetsManager: React.FC<AssetsManagerProps> = ({ assetType, selected, onChange }) => {
  const [tabName, setTabName] = useState(assetType ? TABS.find(t => t === assetType) : 'all');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>(selected || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState<Asset | null>(null);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);

  useEffect(() => {
    if (!assets?.length) {
      handleRefresh()
    }
  }, [])

  useEffect(() => {
    const fAssets = assets.filter(asset =>
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (tabName === 'all' || (tabName === 'images' && asset.parentPath === 'images') || (tabName === 'music' && asset.parentPath === 'music') || (tabName === 'videos' && asset.parentPath === 'videos'))
    );
    setFilteredAssets(fAssets);
  }, [assets, searchQuery, tabName])

  const handleRefresh = () => {
    listAssets().then(allAssets => setAssets(allAssets || []));
  }

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTabName(TABS[newValue]);
  };

  const hasAsset = (assets: Asset[], asset: Asset) => {
    return assets.find(ast => asset.filename === ast.filename && asset.parentPath === ast.parentPath);
  }
  const handleToggle = (asset: Asset) => {
    const alreadySelected = hasAsset(selectedAssets, asset);
    let newSelectedAssets = [...selectedAssets];

    if (!alreadySelected) {
      newSelectedAssets.push(asset);
    } else {
      newSelectedAssets = newSelectedAssets.filter(ast => asset.filename !== ast.filename && asset.parentPath !== ast.parentPath);
    }

    setSelectedAssets(newSelectedAssets);
  };

  const handlePickSelected = () => {
    onChange && onChange(selectedAssets);
  }

  const handleDelete = () => {
    selectedAssets?.length && deleteAssets(selectedAssets).then(() => {
      setSelectedAssets([]);
      handleRefresh();
    }).catch((error) => {
      handleRefresh();
      console.log('Error Deleting Assets', error)
    });
  };

  const getThumbnailSrc = (asset: Asset): string => {
    let tSrc = '';
    if (asset.parentPath === 'images') {
      tSrc = `${endpoints.imageThumb}/${asset.filename}`;
    } else {
      tSrc = `${endpoints.videoThumb}/${asset.name}.jpg`;
    }

    return tSrc;
  }

  const getExtensions = () => {
    switch (assetType) {
      case 'images':
        return ALLOWED_IMAGE_EXTENSIONS;
      case 'music':
        return ALLOWED_MUSIC_EXTENSIONS;
      case 'videos':
        return ALLOWED_VIDEO_EXTENSIONS;
      default:
        return ALLOWED_EXTENSIONS;
    }
  }
  return (<>
    <Box>
      <AppBar position="static">
        <Tabs value={tabName} onChange={handleTabChange} TabIndicatorProps={{ style: { backgroundColor: 'white' } }}>
          <Tab label="All" style={{ color: tabName === 'all' ? 'white' : 'black' }} />
          <Tab label="Images" style={{ color: tabName === 'images' ? 'white' : 'black' }} />
          <Tab label="Audio" style={{ color: tabName === 'music' ? 'white' : 'black' }} />
          <Tab label="Video" style={{ color: tabName === 'videos' ? 'white' : 'black' }} />
        </Tabs>
      </AppBar>
      <Box p={2}>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FilesUpload allowedExtensions={getExtensions()} multiple={true} onChange={() => handleRefresh()} />
        </Box>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <IconButton onClick={handleDelete} disabled={selectedAssets.length === 0}>
            <Delete />
          </IconButton>
          <Button color='success' disabled={!selectedAssets?.length} onClick={handlePickSelected}>Pick Selected({selectedAssets.length}/{assets.length})</Button>
          <Checkbox style={{ marginRight: '10px' }} checked={selectedAssets.length === assets.length} onChange={(e) => setSelectedAssets(e.target.checked ? assets : [])} title='Select all' />
        </Box>
        <Box display="flex" flexWrap="wrap">
          {filteredAssets.map(asset => (
            <Box key={asset.filename} style={{
              backgroundColor: hasAsset(selectedAssets, asset) ? 'rgba(200, 200, 200)' : 'transparent',
              border: '1px solid grey',
              borderRadius: '1em',
              maxWidth: '15em',
              margin: '0.5em',
              overflow: 'hidden'
            }}>
              <ListItem component="div" onClick={() => handleToggle(asset)} onDoubleClick={() => setCurrentSlide(asset)}
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                <ListItemIcon style={{
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {asset.parentPath === 'music' ? <Audiotrack /> : <img src={getThumbnailSrc(asset)} alt={asset.filename} style={{ width: '100%', height: 'auto' }} />}
                  {asset.parentPath === 'videos' && <VideoCameraFront style={{
                    fontSize: '5em',
                    position: 'absolute',
                    zIndex: 2,
                    color: 'white'
                  }} />}
                </ListItemIcon>
                <ListItemText title={asset.filename} primary={asset.filename} style={{ textAlign: 'center', maxWidth: '100%', textOverflow: 'ellipsis' }} />
              </ListItem>
            </Box>
          ))}
        </Box>
        <IconButton onClick={handleDelete} disabled={selectedAssets.length === 0}>
          <Delete />
        </IconButton>
      </Box>
    </Box>
    {currentSlide && <AssetsSlideShow open={!!currentSlide} currentAsset={currentSlide} assets={filteredAssets} onClose={() => setCurrentSlide(null)} />}
  </>);
};

export default AssetsManager
