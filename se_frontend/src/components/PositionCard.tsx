import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import dayjs from 'dayjs';

interface CardProps {
  title: string;
  company: string;
  workArrangement: string;
  location: string;
  interviewStart: string;
  interviewEnd: string;
  openingPosition: number;
  skills: string[];
  salary: {
    min: any;
    max: any;
  }
}
function formatDate(dateString: string){
    return dayjs(dateString).format("MMMM D, YYYY");
};
export default function Card({
  title,
  company,
  workArrangement,
  location,
  interviewStart,
  interviewEnd,
  openingPosition,
  salary
}: CardProps) {
    
  return (
    <Box
    
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '350px',
        transition: 'all 0.2s ease-in-out', // smooth animation
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        },
        cursor: 'pointer',
        
      }}
    >
      {/* Position Title */}
      <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
        {title}
      </Typography>
      
      {/* Company */}
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {company}
      </Typography>
      
      {/* Location Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 0.5 }}>
        <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.primary' }} />
        <Typography variant="body2" color="text.primary">
          {workArrangement}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.primary' }} />
          <Typography variant="body2" color="text.primary">
            {location}
          </Typography>
        </Box>

        
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1.5 }}>
      <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.primary' }} />
        <Typography variant="body2" color="text.primary">
          {`${salary.min} - ${salary.max}`}
        </Typography>
      
      </Box>

      
      {/* Date Range */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DateRangeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.primary' }} />
        <Typography variant="body2" color="text.primary">
          {formatDate(interviewStart)} - {formatDate(interviewEnd)}
        </Typography>
      </Box>
      
      {/* Bottom Row with Openings and Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Chip 
          label={`${openingPosition} Opening${openingPosition > 1 ? 's' : ''}`} 
          variant="outlined" 
          sx={{ 
            borderRadius: '16px',
            bgcolor: '#f5f5f5',
            border: 'none',
            fontWeight: 500,
            color: 'text.primary'
          }} 
        />
        
        <IconButton 
          sx={{ 
            bgcolor: '#1976d2', 
            color: 'white',
            '&:hover': {
              bgcolor: '#1565c0',
            }
          }}
        >
          <ArrowForwardIcon sx={{ transform: 'rotate(-45deg)', width: 30, height: 30}} />
        </IconButton>
      </Box>
    </Box>
  );
}
