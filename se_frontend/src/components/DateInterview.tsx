'use client';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InputLabel, MenuItem, Select, CircularProgress } from '@mui/material';
import { CompanyItem, CompanyJson } from '../../interface';
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import getCompanies from '@/libs/getCompanies';

export default function DateInterview({
  onDateChange, 
  onCompanyChange,
  startDate,
  endDate,
}: {
  onDateChange: Function, 
  onCompanyChange: Function,
  startDate?: Dayjs | null,
  endDate?: Dayjs | null,
}) {
  const [interviewDate, setInterviewDate] = useState<Dayjs|null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem>();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data: CompanyJson = await getCompanies();
        const companyData = data.data;
        
        const formattedCompanies = Array.isArray(companyData) ? companyData.map(company => ({
            ...company,
            value: company._id,
        })) : [];
        
        setCompanies(formattedCompanies);
        setError(null);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
    
    const intervalId = setInterval(fetchCompanies, 30000); 
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <InputLabel id="venue-label">Select Company</InputLabel>
      <Select 
        variant='standard' 
        fullWidth
        id="venue"
        labelId="venue-label"
        value={selectedCompany?.value || ''}
        onChange={(e) => {
          const selected = companies.find(company => company.value === e.target.value);
          setSelectedCompany(selected); 
          onCompanyChange(selected);
        }}
        required
        disabled={loading}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} /> Loading companies...
          </MenuItem>
        ) : error ? (
          <MenuItem disabled>
            Error: {error}
          </MenuItem>
        ) : companies.length > 0 ? (
          companies.map((company) => (
            <MenuItem key={company._id} value={company.value}>
              {company.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No companies available</MenuItem>
        )}
      </Select>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker 
          label={(startDate && endDate) ? `Event Date (${startDate.format('MMM D')} - ${endDate.format('MMM D, YYYY')})` : "Select any Date"}
          value={interviewDate}
          onChange={(value) => {
            setInterviewDate(value); 
            onDateChange(value);
          }}
          slotProps={{ 
            textField: { 
              fullWidth: true, 
              margin: "normal",
              helperText: (startDate && endDate) 
                ? `Please select a date between ${startDate.format('MMM D')} and ${endDate.format('MMM D, YYYY')}`
                : "You can select any date"
            } 
          }}
          minDate={startDate || undefined}
          maxDate={endDate || undefined}
          shouldDisableDate={(date) => {
            if (!startDate || !endDate) return false; // no restrictions if missing
            return date.isBefore(startDate) || date.isAfter(endDate);
          }}
        />
      </LocalizationProvider>
    </>
  );
}
