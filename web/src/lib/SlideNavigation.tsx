import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

interface SlideNavigationProps {
  children: React.ReactNode[];
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % children.length);
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + children.length) % children.length);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="contained" color="primary" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>
      <Box>{children[currentSlide]}</Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="contained" color="primary" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default SlideNavigation;
