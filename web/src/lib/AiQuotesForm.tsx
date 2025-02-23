import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';
import { AiQuote } from '../Services/Ai.interface';
import { applyCompositionsToRawAssets, startGenerating } from '../Services/Ai.service';
import { PROMPT_FORMAT, PROMPT_TEXT } from '../config';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { VideoEngineDataContext } from './VideoEngineDataProvider';
import { LinearProgress } from '@mui/material';
import { CompositionInfo, VideoRecord } from '../Services/Composition.interface';
import CompositionInfoForm from './CompositionInfoForm';
import VideoRecordItem from './VideoRecordItem';
import AssetsSelectInput from './AssetsSelectInput';
import { DEFAULT_COMPSITION_INFO } from '../Services/Composition.constants';
import CodeBlock from './CodeBlock';

interface AiQuotesFormProps {
  defaultVideoRecord?: VideoRecord;
  onChange?: (quotes: VideoRecord[]) => void;
}

const AiQuotesForm: React.FC<AiQuotesFormProps> = ({ onChange }) => {
  const { videoEngineData } = useContext(VideoEngineDataContext);
  const [prompt, setPrompt] = useState(PROMPT_TEXT);
  const [promptFormat, setPromptFormat] = useState(PROMPT_FORMAT);
  const [quotes, setQuotes] = useState<AiQuote[]>([]);
  const [needed, setNeeded] = useState<number>(10);
  const [generating, setGenerating] = useState<boolean>(false);
  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>([]);
  const [imagesPerVideo, setImagesPerVideo] = useState<number>(1);
  const [compositionInfo, setCompositionInfo] = useState<CompositionInfo | null>(DEFAULT_COMPSITION_INFO);
  const [images, setImages] = useState<string[]>([]);
  const [musics, setMusics] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);


  const [progress, setProgress] = useState<{ current: number, total: number, error?: any }>({ current: 0, total: 0 });

  useEffect(() => {
    if (videoEngineData?.dbName) {
      const key = `generatedQuotes-${videoEngineData?.dbName}`;
      const str = localStorage.getItem(key);
      const qS = str && JSON.parse(str) || [];
      setQuotes(qS);
    }
  }, [videoEngineData]);

  const handleGenerateQuotes = async () => {
    setGenerating(true);
    await startGenerating(`${prompt} ${promptFormat}`, needed,
      (current, total, rQuotes, error) => {
        setQuotes(prev => {
          const updatedQuotes = [...rQuotes, ...prev];
          localStorage.setItem(`generatedQuotes-${videoEngineData?.dbName}`, JSON.stringify(updatedQuotes));
          return updatedQuotes;
        });
        setProgress({ current, total, error });
      });
    setGenerating(false);
  };

  const handleConfirm = () => {
    onChange && onChange(videoRecords);
  };

  const handleCompositionChange = (cmpInfo: CompositionInfo) => {
    setCompositionInfo(cmpInfo);
  }

  const handleApplyComposition = () => {
    const vRecords = applyCompositionsToRawAssets(compositionInfo, quotes, imagesPerVideo, images, videos, musics)
    setVideoRecords(vRecords)
    // Run Merging
  }


  const handleAssetsChange = (name: string, strAssets: string[]) => {
    switch (name) {
      case 'images':
        setImages(strAssets);
        break;
      case 'musics':
        setMusics(strAssets);
        break;
      case 'videos':
        setVideos(strAssets);
        break;
    }
  };

  return (<>
    <Box>
      <Accordion style={{ marginTop: '1em', width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Generate Raw Quotes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <TextField style={{ marginTop: '1em' }}
              label="Prompt"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <TextField style={{ marginTop: '1em' }}
              label="Total Quotes needed"
              type="number"
              variant="outlined"
              fullWidth
              value={needed}
              onChange={(e) => setNeeded(parseInt(e.target.value, 10))}
            />
            <Accordion style={{ marginTop: '1em', width: '100%' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Additional Prompt"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={promptFormat}
                  onChange={(e) => setPromptFormat(e.target.value)}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            {!generating && <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateQuotes}
              style={{ marginTop: '1em' }}
            >
              Generate Quotes
            </Button>}
            {generating && (<>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '1em' }}>
                Generating: {progress.current} / {progress.total}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(progress.current / progress.total) * 100}
                style={{ width: '100%', marginTop: '8px' }}
              />
              <CircularProgress variant="indeterminate" />
              {progress.error && (
                <Typography variant="body2" color="error" style={{ marginTop: '1em' }}>
                  {progress.error.message}
                </Typography>
              )}
            </>)}
          </Box>
          <Typography variant="h6" color="success" style={{ marginTop: '1em', marginBottom: '1em' }}>
            Total generated: {quotes.length}
          </Typography>
          <CodeBlock style={{ display: 'flex', justifyContent: 'flex-end' }} value={quotes} onChange={(vRs: any) => setQuotes(vRs)} />
          <List style={{
            maxHeight: '25em',
            overflow: 'auto'
          }}>

            {quotes.map((quote, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={quote.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {quote.title}
                      </Typography>
                      <br />
                      {quote.summary}
                      <br />
                      {quote.translation}
                      <br />
                      Tags: {quote.tags.join(', ')}
                      <br />
                      HashTags: {quote.hashTags.join(', ')}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ marginTop: '1em', width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Convert Raw Quotes to Video Records</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" color="primary" style={{ marginTop: '1em', marginBottom: '1em' }}>
            Base Video Composition
          </Typography>
          <Typography variant="body2" color="success" style={{ marginTop: '1em', marginBottom: '1em' }}>
            This composition will be merged with each of the Raw Quote, to get the final Video records.
            Images, Videos, and Music from the composition, will be randomly assigned to each Quote.
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <TextField
              style={{ marginTop: '1em', marginBottom: '1em' }}
              label="Number of images per Video"
              type='number'
              variant="outlined"
              fullWidth
              value={imagesPerVideo}
              onChange={(e) => setImagesPerVideo(parseInt(e.target.value, 10))}
            />

            <AssetsSelectInput value={musics} assetType='music' label='Music' name='music'
              onChange={(musics) => handleAssetsChange('musics', musics as string[])} />

            <AssetsSelectInput value={images} assetType='images' label='Images' name='images'
              onChange={(images) => handleAssetsChange('images', images as string[])} />

            <AssetsSelectInput value={videos} assetType='videos' label='Videos' name='videos'
              onChange={(videos) => handleAssetsChange('videos', videos as string[])} />

            <CompositionInfoForm initialData={undefined} onChange={handleCompositionChange} />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleApplyComposition}
              style={{ marginTop: '1em' }}
            >
              Apply Composition to Raw Quotes
            </Button>
            <Typography variant="body2" color="success" style={{ marginTop: '1em', marginBottom: '1em' }}>
              Merging will also remove all duplicates.
            </Typography>
          </Box>
          {/* List Video records */}
          <Typography variant="h6" color="primary" style={{ marginTop: '1em', marginBottom: '1em' }}>
            Total: {videoRecords?.length || 0}
          </Typography>
          <CodeBlock style={{ display: 'flex', justifyContent: 'flex-end' }} value={videoRecords} onChange={(vRs: any) => setVideoRecords(vRs)} />
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" flexWrap="wrap">
            {
              videoRecords?.map(vR => <VideoRecordItem value={vR} />)
            }
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleConfirm}
              style={{ marginTop: '1em' }}
            >
              Confirm & Save
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  </>);
};

export default AiQuotesForm;
