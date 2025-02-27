import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import { Close, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { endpoints } from '../Services/Render.service';

interface RenderedVideosSlideShowProps {
  videos: string[];
  currentVideo: string;
  open: boolean;
  onClose: () => void;
}

const RenderedVideosSlideShow: React.FC<RenderedVideosSlideShowProps> = ({ videos, currentVideo, open, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState<string>(currentVideo);
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (currentSlide) {
      setSrc(`${endpoints.outVideos}/${currentSlide}`);
    }
  }, [currentSlide, videos]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videos]);

  const findCurrentVideoIndex = () => {
    return videos.indexOf(currentSlide);
  }

  const handleNext = () => {
    let currentIndex = findCurrentVideoIndex();
    currentIndex++;
    const nextIndex = currentIndex >= videos.length ? 0 : currentIndex;
    setCurrentSlide(videos[nextIndex]);
  };

  const handlePrevious = () => {
    let currentIndex = findCurrentVideoIndex();
    currentIndex--;
    const prevIndex = currentIndex <= 0 ? videos.length - 1 : currentIndex;
    setCurrentSlide(videos[prevIndex]);
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
        {videos?.length > 1 && <> <IconButton
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
          </IconButton></>}
        <Box style={{
          display: 'flex',
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto'
        }}>
          <video key={src} controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
            <source src={src} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </Box>
        <Typography mt={'1em'}>{currentSlide}</Typography>
      </Box>
    </Modal>
  );
};

export default RenderedVideosSlideShow;
