"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  TextField, Button, Box, Container, Typography, Paper, CircularProgress, FormControl,
  InputLabel, Select, MenuItem, IconButton
} from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import getPositionById from '@/libs/getPositionById';
import updatePosition from '@/libs/updatePosition';
import { PositionItem } from '../../../../../interface';

export default function EditPosition({ params }: { params: { pid: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [position, setPosition] = useState<PositionItem>({
    _id: "",
    title: "",
    company: {
      _id: "",
      name: "",
      address: "",
      website: "",
      description: "",
      tel: "",
      tags: [],
      logo: "",
      about: "",
      companySize: "",
      overview: "",
      foundedYear: "",
      __v: 0,
      value: ""
    },
    description: "",
    responsibilities: [""],
    requirements: [""],
    workArrangement: "",
    location: "",
    interviewStart: "",
    interviewEnd: "",
    createdAt: "",
    openingPosition: 1
  });

  // Fetch position data
  useEffect(() => {
    const fetchPosition = async () => {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const data = await getPositionById(params.pid);
          if (data && data.data) {
            setPosition(data.data);
          } else {
            toast.error("Failed to load position data");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching position:", error);
          toast.error("Failed to load position data");
          setLoading(false);
        }
      }
    };

    if (params.pid) {
      fetchPosition();
    }
  }, [params.pid, status]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPosition({ ...position, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setPosition({ ...position, [name]: value });
  };

  // Handle number changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure the value is a positive number
    const numValue = parseInt(value) || 0;
    const positiveValue = Math.max(1, numValue); // Minimum value of 1
    
    setPosition({ ...position, [name]: positiveValue });
  };

  // Handle array item changes (responsibilities and requirements)
  const handleArrayItemChange = (arrayName: 'responsibilities' | 'requirements', index: number, value: string) => {
    setPosition(prevState => {
      const newArray = [...prevState[arrayName]];
      newArray[index] = value;
      return {
        ...prevState,
        [arrayName]: newArray
      };
    });
  };

  // Add new item to array (responsibilities or requirements)
  const addArrayItem = (arrayName: 'responsibilities' | 'requirements') => {
    setPosition(prevState => ({
      ...prevState,
      [arrayName]: [...prevState[arrayName], '']
    }));
  };

  // Remove item from array (responsibilities or requirements)
  const removeArrayItem = (arrayName: 'responsibilities' | 'requirements', index: number) => {
    if (position[arrayName].length <= 1) {
      return; // Keep at least one item
    }
    
    setPosition(prevState => {
      const newArray = prevState[arrayName].filter((_, i) => i !== index);
      return {
        ...prevState,
        [arrayName]: newArray
      };
    });
  };

  // Handle date changes
  const handleDateChange = (name: string, date: any) => {
    setPosition({ ...position, [name]: date ? date.format('YYYY-MM-DD') : '' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position.title) {
      toast.error("Position title is required");
      return;
    }
    
    try {
      setUpdating(true);
      
      // Clean up arrays by removing empty items
      const cleanedPosition = {
        ...position,
        responsibilities: position.responsibilities.filter(item => item.trim() !== ''),
        requirements: position.requirements.filter(item => item.trim() !== '')
      };
      
      const result = await updatePosition(cleanedPosition);
      
      if (result && result.success) {
        toast.success("Position updated successfully");
        router.push(`/position/${position._id}`);
      } else {
        toast.error("Failed to update position");
      }
      setUpdating(false);
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Failed to update position");
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "80vh",
        bgcolor: "white" 
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        <Toaster position="top-center" />
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Edit Position
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: "white" }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="subtitle1" fontWeight="bold">Title</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              name="title"
              value={position.title}
              onChange={handleChange}
              variant="outlined"
              sx={{ mt: 0.5, mb: 2 }}
            />
            
            <Typography variant="subtitle1" fontWeight="bold">Number of Openings</Typography>
            <TextField
              margin="normal"
              fullWidth
              id="openingPosition"
              name="openingPosition"
              type="number"
              value={position.openingPosition}
              onChange={handleNumberChange}
              variant="outlined"
              inputProps={{ min: 1 }}
              sx={{ mt: 0.5, mb: 2 }}
            />
            
            <Typography variant="subtitle1" fontWeight="bold">Company</Typography>
            <TextField
              margin="normal"
              fullWidth
              id="company"
              name="company"
              value={position.company.name}
              variant="outlined"
              InputProps={{
                readOnly: true,
                disableUnderline: true,
                sx: { bgcolor: '#f5f5f5', pointerEvents: 'none' }
              }}
              disabled
              sx={{ mt: 0.5, mb: 2, cursor: 'default' }}
            />
            
            <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
            <TextField
              margin="normal"
              fullWidth
              id="description"
              name="description"
              value={position.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={3}
              sx={{ mt: 0.5, mb: 2 }}
            />
            
            <Typography variant="subtitle1" fontWeight="bold">Responsibilities</Typography>
            <Box sx={{ mt: 0.5, mb: 2 }}>
              {position.responsibilities.map((responsibility, index) => (
                <Box key={`resp-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    value={responsibility}
                    onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', ml: 1 }}>
                    {index === position.responsibilities.length - 1 && (
                      <IconButton 
                        color="primary" 
                        onClick={() => addArrayItem('responsibilities')}
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                    {position.responsibilities.length > 1 && (
                      <IconButton 
                        color="error" 
                        onClick={() => removeArrayItem('responsibilities', index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">Requirements</Typography>
            <Box sx={{ mt: 0.5, mb: 2 }}>
              {position.requirements.map((requirement, index) => (
                <Box key={`req-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    value={requirement}
                    onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', ml: 1 }}>
                    {index === position.requirements.length - 1 && (
                      <IconButton 
                        color="primary" 
                        onClick={() => addArrayItem('requirements')}
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                    {position.requirements.length > 1 && (
                      <IconButton 
                        color="error" 
                        onClick={() => removeArrayItem('requirements', index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">Work arrangement</Typography>
            <FormControl fullWidth sx={{ mt: 0.5, mb: 2 }}>
              <Select
                id="workArrangement"
                name="workArrangement"
                value={position.workArrangement}
                onChange={handleSelectChange}
              >
                <MenuItem value="On-site">On-site</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle1" fontWeight="bold">Location</Typography>
            <TextField
              margin="normal"
              fullWidth
              id="location"
              name="location"
              value={position.location}
              onChange={handleChange}
              variant="outlined"
              sx={{ mt: 0.5, mb: 2 }}
            />
            
            <Typography variant="subtitle1" fontWeight="bold">Interview date</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={position.interviewStart ? dayjs(position.interviewStart) : null}
                  onChange={(date) => handleDateChange('interviewStart', date)}
                  sx={{ flex: 1 }}
                />
                <Typography>to</Typography>
                <DatePicker
                  value={position.interviewEnd ? dayjs(position.interviewEnd) : null}
                  onChange={(date) => handleDateChange('interviewEnd', date)}
                  sx={{ flex: 1 }}
                />
              </LocalizationProvider>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={updating}
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 2,
                  fontSize: '1rem',
                  bgcolor: '#1976d2'
                }}
              >
                {updating ? <CircularProgress size={24} color="inherit" /> : "Update"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
