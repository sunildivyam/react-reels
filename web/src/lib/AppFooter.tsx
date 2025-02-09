import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

const AppFooter: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar>
          <Typography variant="body1" color="inherit">
            © 2025 GlobalDew. All rights reserved.
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppFooter;
