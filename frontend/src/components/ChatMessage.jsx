import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { format, isValid, parseISO } from 'date-fns';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ message, isBot = false, timestamp }) => {
  // Safely format timestamp
  let formattedTime = '';
  try {
    if (timestamp) {
      // Try to parse the timestamp
      const date = parseISO(timestamp);
      if (isValid(date)) {
        formattedTime = format(date, 'HH:mm');
      } else {
        // Try alternative parsing
        const altDate = new Date(timestamp);
        if (isValid(altDate)) {
          formattedTime = format(altDate, 'HH:mm');
        }
      }
    }
  } catch (error) {
    console.warn('Error formatting timestamp:', timestamp, error);
    formattedTime = '';
  }

  return (
    <Box
      display="flex"
      flexDirection={isBot ? 'row' : 'row-reverse'}
      alignItems="flex-start"
      mb={2}
    >
      <Avatar sx={{ bgcolor: isBot ? 'primary.main' : 'secondary.main', mx: 1 }}>
        {isBot ? <BotIcon /> : <PersonIcon />}
      </Avatar>
      
      <Box maxWidth="80%" sx={{ minWidth: '300px' }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isBot ? 'primary.light' : 'grey.100',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="caption" color="textSecondary">
              {isBot ? 'Assistant' : 'You'}
            </Typography>
            {formattedTime && (
              <Typography variant="caption" color="textSecondary">
                {formattedTime}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ 
            '& p': { my: 1, lineHeight: 1.6 },
            '& h1, & h2, & h3': { 
              mt: 2, 
              mb: 1,
              color: isBot ? 'primary.dark' : 'text.primary'
            },
            '& ul, & ol': { 
              pl: 3, 
              my: 1 
            },
            '& li': { 
              my: 0.5 
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              my: 2,
              '& th, & td': {
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              },
              '& th': {
                backgroundColor: isBot ? 'primary.light' : 'grey.200',
                fontWeight: 'bold',
              },
              '& tr:nth-of-type(even)': {
                backgroundColor: isBot ? 'rgba(25, 118, 210, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              },
            },
            '& blockquote': {
              borderLeft: `4px solid ${isBot ? '#1976d2' : '#dc004e'}`,
              pl: 2,
              ml: 0,
              my: 2,
              fontStyle: 'italic',
              color: 'text.secondary',
            },
            '& code': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '2px 4px',
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
            },
            '& pre': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              my: 2,
            },
          }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message}
            </ReactMarkdown>
          </Box>
          
          {isBot && message.includes('Data not found') && (
            <Chip
              label="No relevant information found"
              color="warning"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;