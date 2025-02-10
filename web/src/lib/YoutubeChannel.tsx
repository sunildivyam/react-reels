import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { ChannelInfo } from '../Services/youtube.interface';

interface YoutubeChannelProps {
  channelInfo: ChannelInfo;
}

const YoutubeChannel: React.FC<YoutubeChannelProps> = ({ channelInfo }) => {
  const { id, title, description, thumbnails } = channelInfo;
  const { url, width } = thumbnails?.default;

  return (
    <Card sx={{ display: 'flex' }}>
      <CardMedia
        component="img"
        width={width}
        image={url}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom component="div">
          Channel Id: <small>{id}</small>
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default YoutubeChannel;
