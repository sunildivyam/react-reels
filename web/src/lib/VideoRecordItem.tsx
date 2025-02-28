import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { VideoRecord } from '../Services/Composition.interface';
import { YouTube } from '@mui/icons-material';
import { YOUTUBE_WATCH_URL } from '../config';
import RenderedVideosSlideShow from './RenderedVideosSlideShow';

interface VideoRecordItemProps {
  value: VideoRecord;
}

const VideoRecordItem: React.FC<VideoRecordItemProps> = ({ value }) => {
  if (!value) return null;
  const [open, setOpen] = useState<boolean>(false);
  const { id, outFileName, renderedOn, compositionInfo, youTube } = value;
  const { title, summary, subTitle, translation } = (compositionInfo.defaultProps || {}) as any;
  const { uploadedOn } = youTube || {};
  // const outUrl = `${endpoints.outVideos}/${outFileName}`;

  return (<>
    <Card>
      <CardContent>
        {id && <Typography variant="h6">{id}</Typography>}
        {title && <Typography variant="h5">{title}</Typography>}
        {subTitle && <Typography variant="body2">{subTitle}</Typography>}
        {summary && <Typography variant="h6">{summary}</Typography>}
        {translation && <Typography variant="h6">{translation}</Typography>}
        <Typography variant="body2" color="text.secondary">
          Duration: {compositionInfo?.durationInSeconds} seconds
        </Typography>
        <Typography color="text.secondary" style={{ marginTop: '1em' }} component={'p'}>{`Rendered File: ${outFileName || 'pending'}`}</Typography>
        <Typography color="text.secondary" style={{ marginTop: '1em' }} component={'p'}>{`Rendered On: ${renderedOn || 'pending'}`}</Typography>
        {outFileName && (
          <Typography color="primary" style={{ marginTop: '1em' }} component={'p'} onClick={(e) => { e.stopPropagation(); setOpen(true) }}>
            <YouTube color='primary' style={{ verticalAlign: 'middle' }} /> Watch Rendered Video
          </Typography>
        )}
        <Typography color="text.secondary" style={{ marginTop: '1em' }} component={'p'}>{`Uploaded On: ${uploadedOn || 'pending'}`}</Typography>
        {youTube?.videoId && (
          <Typography color="primary" style={{ marginTop: '1em' }} component={'p'}>
            <a href={`${YOUTUBE_WATCH_URL}${youTube.videoId}`} target="_blank" rel="noopener noreferrer">
              <YouTube color='error' style={{ verticalAlign: 'middle' }} /> Watch on YouTube (after {youTube.publishedAt?.toString() || ''})
            </a>
          </Typography>
        )}
      </CardContent>
    </Card>
    <RenderedVideosSlideShow videos={[outFileName]} currentVideo={outFileName} open={open} onClose={() => setOpen(false)} />
  </>);
};

export default VideoRecordItem;
