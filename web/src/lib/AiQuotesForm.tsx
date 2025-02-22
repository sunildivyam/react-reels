import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { AiQuote } from '../Services/Ai.interface';
import { generateQuotes } from '../Services/Ai.service';
import { PROMPT_FORMAT, PROMPT_TEXT } from '../config';

interface AiQuotesFormProps {
  onChange: (quotes: AiQuote[]) => void;
}

const AiQuotesForm: React.FC<AiQuotesFormProps> = ({ onChange }) => {
  const [prompt, setPrompt] = useState(PROMPT_TEXT);
  const [promptFormat, setPromptFormat] = useState(PROMPT_FORMAT);

  const [quotes, setQuotes] = useState<AiQuote[]>([]);

  const handleGenerateQuotes = async () => {
    const generatedQuotes = await generateQuotes(`${prompt} ${promptFormat}`);
    setQuotes(generatedQuotes);
  };

  const handleConfirm = () => {
    onChange(quotes);
  };

  return (<>
    <Box>
      <TextField
        label="Prompt"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <TextField
        label="Format"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={promptFormat}
        onChange={(e) => setPromptFormat(e.target.value)}
        style={{ marginTop: '16px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateQuotes}
        style={{ marginTop: '16px' }}
      >
        Generate Quotes
      </Button>
      <List>
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
      <Button
        variant="contained"
        color="secondary"
        onClick={handleConfirm}
        style={{ marginTop: '16px' }}
      >
        Confirm
      </Button>
    </Box>
  </>);
};

export default AiQuotesForm;
