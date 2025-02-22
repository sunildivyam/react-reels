import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import { Close, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Asset } from '../Services/AssetsManager.interface';
import { endpoints } from '../Services/AssetsManager.service';

interface AssetsSlideShowProps {
  assets: Asset[];
  currentAsset: Asset;
  open: boolean;
  onClose: () => void;
}

const AssetsSlideShow: React.FC<AssetsSlideShowProps> = ({ assets, currentAsset, open, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState<Asset>(currentAsset);
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (currentSlide) {
      setSrc(`${endpoints.assets}/${currentSlide.parentPath}/${currentSlide.filename}`);
    }
  }, [currentSlide, assets]);

  const findCurrentAssetIndex = () => {
    return assets.findIndex(asset => (asset.filename === currentSlide.filename && asset.parentPath === currentSlide.parentPath));
  }
  const handleNext = () => {
    const currentIndex = findCurrentAssetIndex();
    const nextIndex = (currentIndex + 1) % assets.length;
    setCurrentSlide(assets[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = findCurrentAssetIndex();
    const prevIndex = (currentIndex - 1 + assets.length) % assets.length;
    setCurrentSlide(assets[prevIndex]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'relative',
          width: '90%',
          height: '90%',
          margin: 'auto',
          top: '5%',
          backgroundColor: 'white',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <Close />
        </IconButton>
        <IconButton
          sx={{ position: 'absolute', marigin: '1em', left: 8, top: '50%', transform: 'translateY(-50%)' }}
          onClick={handlePrevious}
        >
          <ArrowBackIos />
        </IconButton>
        <IconButton
          sx={{ position: 'absolute', marigin: '1em', right: 8, top: '50%', transform: 'translateY(-50%)' }}
          onClick={handleNext}
        >
          <ArrowForwardIos />
        </IconButton>
        <Box style={{
          display: 'flex',
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto'
        }}>
          {currentSlide.parentPath.includes('music') && (
            <audio controls key={src}>
              <source src={src} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          {currentSlide.parentPath.includes('videos') && (
            <video key={src} controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
              <source src={src} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          )}
          {currentSlide.parentPath.includes('images') && <img src={src} alt={`Slide ${currentSlide.filename}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />}
        </Box>
        <Typography mt={'1em'}>{currentSlide.filename}</Typography>
      </Box>
    </Modal>
  );
};

export default AssetsSlideShow;
