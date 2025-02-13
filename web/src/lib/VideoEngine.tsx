import React from 'react';
import SlideNavigation from './SlideNavigation';
import CompositionsHome from './CompositionsHome';
import YoutubeHome from './YoutubeHome';
import VideoEngineDataProvider from './VideoEngineDataProvider';


// Main component that uses the provider
const VideoEngine: React.FC = () => {
  // Create the context with default values

  return (
    <VideoEngineDataProvider>
      <SlideNavigation>
        <CompositionsHome />
        <YoutubeHome />
      </SlideNavigation>
    </VideoEngineDataProvider>
  );
};

export default VideoEngine;
