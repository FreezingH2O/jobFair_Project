"use client"

import { useState, useEffect } from 'react';
import getCompanies from '@/libs/getCompanies';
import { InputLabel, MenuItem, Select, CircularProgress, IconButton, TextField } from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import createPosition from '@/libs/createPosition';
import { CompanyItem, CompanyJson } from '../../../../interface';

export default function AddPositionPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    "title": '',
    "description": '',
    "responsibilities": [''],
    "requirements": [''],
    "workArrangement": '',
    "location": '',
    "interviewStart": '',
    "interviewEnd": '',
    "company": '',
    "openingPosition": 1, // Add default value of 1
    "skills": [''],
    "salary": {
      "min":0,
      "max":0
    }
  });
  const [skillsInput, setSkillsInput] = useState('');


  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const response = await getCompanies();
        if (Array.isArray(response)) {
          setCompanies(response);
        } else if (response && typeof response === 'object' && response.data) {
          setCompanies(Array.isArray(response.data) ? response.data : []);
        } else {
          console.error('Companies data is not in expected format:', response);
          toast.error("Failed to load companies");
          setCompanies([]);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error("Failed to load companies");
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    if (name === "salaryMin" || name === "salaryMax") {
      const numericValue = parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        salary: {
          ...prev.salary,
          [name === "salaryMin" ? "min" : "max"]: numericValue,
        },
      }));
    } else if (name === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: value.split(',').map((skill: string) => skill.trim())

      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // setFormData(prevState => ({
    //   ...prevState,
    //   [name]: value
    // }));
  };

  const handleNumberChange = (e:any) => {
    const { name, value } = e.target;
    // Ensure the value is a positive number
    const numValue = parseInt(value) || 0;
    const positiveValue = Math.max(1, numValue); // Minimum value of 1
    
    setFormData(prevState => ({
      ...prevState,
      [name]: positiveValue
    }));
  };

  const handleMuiChange = (name:any, value:any) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleArrayItemChange = (arrayName: keyof typeof formData, index: number, value: string) => {
    setFormData(prevState => {
      const newArray = [...(prevState[arrayName] as string[])];
      newArray[index] = value;
      return {
        ...prevState,
        [arrayName]: newArray
      };
    });
  };

  const addArrayItem = (arrayName: keyof typeof formData) => {
      setFormData(prevState => ({
        ...prevState,
        [arrayName]: [...(prevState[arrayName] as string[]), '']
      }));
    };

  const removeArrayItem = (arrayName: keyof typeof formData, index: number) => {
      if ((formData[arrayName] as string[]).length <= 1) {
      return; // Keep at least one item
    }
    
    setFormData(prevState => {
        // Type assertion to tell TypeScript that this is definitely an array
        const currentArray = prevState[arrayName] as string[];
        const newArray = currentArray.filter((_, i) => i !== index);
        return {
          ...prevState,
          [arrayName]: newArray
        };
      });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title) {
      toast.error("Please enter a position title");
      return;
    }
    
    if (!formData.company) {
      toast.error("Please select a company");
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading("Creating position...");
    setSubmitting(true);
    
    try {
      const cleanedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  
      // Filter out empty items from arrays
      const cleanedFormData = {
        ...formData,
        skill: cleanedSkills,
        responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        openingPosition: Number(formData.openingPosition) || 1 // Ensure it's a number
      };
      
      console.log('Form submitted:', cleanedFormData);
      const result = await createPosition(cleanedFormData);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`Position "${formData.title}" created successfully!`);
      
      // Reset form after successful submission
      setFormData({
        "title": '',
        "description": '',
        "responsibilities": [''],
        "requirements": [''],
        "workArrangement": '',
        "location": '',
        "interviewStart": '',
        "interviewEnd": '',
        "company": '',
        "openingPosition": 1,
        "skills": [],
        "salary": {
          "min":0,
          "max":0
    }
      });
      
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      console.error('Error creating position:', error);
      toast.error("Failed to create position. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-6 text-black">Add Position</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-medium mb-1 text-black">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 rounded border-0 text-black"
              required
            />
          </div>
          
          <div>
            <label htmlFor="openingPosition" className="block font-medium mb-1 text-black">Number of Openings</label>
            <input
              type="number"
              id="openingPosition"
              name="openingPosition"
              value={formData.openingPosition}
              onChange={handleNumberChange}
              min="1"
              className="w-full p-2 bg-gray-100 rounded border-0 text-black"
            />
          </div>
          
          <div>
            <InputLabel id="company-label" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={formData.company}
              onChange={(e) => handleMuiChange('company', e.target.value)}
              className="w-full"
              variant="standard"
              displayEmpty
              required
              disabled={loadingCompanies}
            >
              <MenuItem value="" disabled>
                {loadingCompanies ? "Loading companies..." : "Select a company"}
              </MenuItem>
              
              {loadingCompanies ? (
                <MenuItem disabled>
                  <CircularProgress size={20} /> Loading companies...
                </MenuItem>
              ) : companies.length > 0 ? (
                companies.map((company:CompanyItem) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No companies available</MenuItem>
              )}
            </Select>
          </div>
          
          <div>
            <label htmlFor="description" className="block font-medium mb-1 text-black">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 rounded border-0 text-black"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-black">Responsibilities</label>
            {formData.responsibilities.map((responsibility, index) => (
              <div key={`resp-${index}`} className="flex items-center mb-2">
                <TextField
                  value={responsibility}
                  onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
                  placeholder={`Responsibility ${index + 1}`}
                  variant="outlined"
                  size="small"
                  className="flex-grow"
                />
                <div className="flex ml-2">
                  {index === formData.responsibilities.length - 1 && (
                    <IconButton 
                      color="primary" 
                      onClick={() => addArrayItem('responsibilities')}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                  {formData.responsibilities.length > 1 && (
                    <IconButton 
                      color="error" 
                      onClick={() => removeArrayItem('responsibilities', index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-black">Requirements</label>
            {formData.requirements.map((requirement, index) => (
              <div key={`req-${index}`} className="flex items-center mb-2">
                <TextField
                  value={requirement}
                  onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                  variant="outlined"
                  size="small"
                  className="flex-grow"
                />
                <div className="flex ml-2">
                  {index === formData.requirements.length - 1 && (
                    <IconButton 
                      color="primary" 
                      onClick={() => addArrayItem('requirements')}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                  {formData.requirements.length > 1 && (
                    <IconButton 
                      color="error" 
                      onClick={() => removeArrayItem('requirements', index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              </div>
            ))}
          </div>
              <div>
              <label className="block font-medium text-black">Skills</label>
              <TextField
  label="Skills (comma separated)"
  fullWidth
  value={skillsInput}
  onChange={(e) => setSkillsInput(e.target.value)}
  onBlur={() => {
    setFormData((prev) => ({
      ...prev,
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    }));
  }}
  variant="outlined"
  helperText="Separate skills with commas"
/>

          </div>

            <label className="block font-medium text-black mt-4">Salary Range</label>
            <div className="flex items-center gap-2 mb-10">
            <TextField
              margin="none"
              label="Min Salary"
              name="salaryMin"
              type="number"
              value={formData.salary.min}
              onChange={handleChange}
              variant="outlined"
              className="w-28 bg-gray-200 rounded-md"
              size="small"
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
            <span className="text-black px-1 text-sm">-</span>
            <TextField
              margin="none"
              label="Max Salary"
              name="salaryMax"
              type="number"
              value={formData.salary.max}
              onChange={handleChange}
              variant="outlined"
              className="w-28 bg-gray-200 rounded-md"
              size="small"
              InputProps={{
                inputProps: { min: formData.salary.min || 0 },
              }}
            />
          </div>


         
            
          
          <div>
            <InputLabel id="work-arrangement-label" className="block text-sm font-medium text-gray-700 mb-1 mt-6">
              Work arrangement
            </InputLabel>
            <Select
              labelId="work-arrangement-label"
              id="workArrangement"
              value={formData.workArrangement}
              onChange={(e) => handleMuiChange('workArrangement', e.target.value)}
              className="w-full"
              variant="standard"
              displayEmpty
              required
            >
              <MenuItem value="" disabled>Select work arrangement</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
              <MenuItem value="On-site">On-site</MenuItem>
            </Select>
          </div>
          
          <div>
            <label htmlFor="location" className="block font-medium mb-1 text-black">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 rounded border-0 text-black"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-black">Interview date</label>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                id="interviewStart"
                name="interviewStart"
                value={formData.interviewStart}
                onChange={handleChange}
                className="p-2 bg-white border border-gray-300 rounded text-black"
              />
              <span className="text-black">to</span>
              <input
                type="date"
                id="interviewEnd"
                name="interviewEnd"
                value={formData.interviewEnd}
                onChange={handleChange}
                className="p-2 bg-white border border-gray-300 rounded text-black"
              />
            </div>
          </div>
        </form>
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-6 ${submitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 px-6 rounded-md flex items-center`}
      >
        {submitting ? (
          <>
            <CircularProgress size={16} color="inherit" className="mr-2" />
            Creating...
          </>
        ) : (
          'Add new position'
        )}
      </button>
    </div>
  );
}
