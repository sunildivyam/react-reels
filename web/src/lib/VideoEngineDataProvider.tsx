import { createContext, useState } from "react";
import { VideoEngineType } from "../Services/Composition.interface";

export interface VideoEngineDataContextType {
  videoEngineData?: VideoEngineType | null;
  updateVideoEngineData?: (data: VideoEngineType) => void;
}

export const VideoEngineDataContext = createContext<VideoEngineDataContextType>({});

interface VideoEngineDataProviderProps {
  children: React.ReactNode
}
const VideoEngineDataProvider: React.FC<VideoEngineDataProviderProps> = ({ children }) => {
  const initialData = JSON.parse(localStorage.getItem('videoEngineData') || '{}');
  const [videoEngineData, setVideoEngineData] = useState<VideoEngineType>(initialData);

  const updateVideoEngineData = (data: VideoEngineType) => {

    setVideoEngineData((prev) => {
      const ndata = ({ ...prev, ...data });
      localStorage.setItem('videoEngineData', JSON.stringify(ndata));
      return ndata;
    });
  };

  return (
    <VideoEngineDataContext.Provider value={{ videoEngineData, updateVideoEngineData }}>
      {children}
    </VideoEngineDataContext.Provider>
  );
};

export default VideoEngineDataProvider;
