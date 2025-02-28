import React from 'react';
import SlideNavigation from './SlideNavigation';
import CompositionsHome from './CompositionsHome';
import YoutubeHome from './YoutubeHome';
import VideoEngineDataProvider from './VideoEngineDataProvider';
import RenderHome from './RenderHome';


// Main component that uses the provider
const VideoEngine: React.FC = () => {
  // Create the context with default values

  return (
    <VideoEngineDataProvider>
      <SlideNavigation>
        <CompositionsHome />
        <RenderHome/>
        <YoutubeHome />
      </SlideNavigation>
    </VideoEngineDataProvider>
  );
};

export default VideoEngine;
