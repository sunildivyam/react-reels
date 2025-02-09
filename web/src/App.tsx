
import './App.css'
import AppFooter from './lib/AppFooter'
import MainNav from './lib/MainNav'
import { Container, CssBaseline } from '@mui/material'
import React from 'react'
import { navItems } from './config';
import YoutubeHome from './lib/YoutubeHome'

const App: React.FC = () => {
  return (<>
    <CssBaseline />
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <MainNav sticky={true} items={navItems} />
      <Container component="main" style={{ flex: 1 }}>
        <YoutubeHome />
      </Container>
      <AppFooter />
    </div >
  </>
  )
}

export default App
