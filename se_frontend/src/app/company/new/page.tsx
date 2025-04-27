"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  TextField, 
  Button, 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import createCompany from "@/libs/createCompany";

// Company size options based on your schema
const companySizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

export default function CreateCompany() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [creating, setCreating] = useState(false);
  const [company, setCompany] = useState<{
    name: string;
    address: string;
    website: string;
    description: string;
    tel: string;
    tags: string[];
    logo: string;
    companySize: string;
    overview: string;
    foundedYear: string;

  }>({
    name: "",
    address: "",
    website: "",
    tel: "",
    tags: [],
    logo: "",
    description: "",
    companySize: "",
    overview: "",
    foundedYear: "",
  });

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "tags") {
      // Convert comma-separated string to array
      setCompany({ ...company, [name]: value.split(",").map(tag => tag.trim()) });
    } else {
      setCompany({ ...company, [name]: value });
    }
  };

  // Handle select changes
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company.name) {
      toast.error("Company Name is required");
      return;
    }
    
    if (!company.address) {
      toast.error("Company Address is required");
      return;
    }

    if (!company.website) {
      toast.error("Company Website is required");
      return;
    }
    
    if (!company.description) {
      toast.error("Company Description is required");
      return;
    }
    
    if (!company.companySize) {
      toast.error("Company Size is required");
      return;
    }
    
    
    
    try {
      setCreating(true);
      await createCompany(company);
      toast.success("Company created successfully");
      router.push("/company");
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Failed to create company");
    } finally {
      setCreating(false);
    }
  };

  if (status === "loading") {
    return (
      <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        <Toaster position="top-center" />
        <Typography variant="h4" component="h1" align="center" gutterBottom color="text.primary">
          Create New Company
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: "white" }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Company Name"
              name="name"
              value={company.name}
              onChange={handleChange}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              value={company.address}
              onChange={handleChange}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="tel"
              label="Telephone"
              name="tel"
              value={company.tel}
              onChange={handleChange}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="website"
              label="Website"
              name="website"
              value={company.website}
              onChange={handleChange}
              variant="outlined"
            />
{/*             
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={company.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={3}
            /> */}
            
            <TextField
              required
              margin="normal"
              fullWidth
              id="description"
              label="description"
              name="description"
              value={company.description}
              onChange={handleChange}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="tags"
              label="Tags (comma separated)"
              name="tags"
              value={company.tags.join(", ")}
              onChange={handleChange}
              variant="outlined"
              helperText="Enter industry tags separated by commas"
            />
            
            {/* Dropdown selector for companySize */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="company-size-label">Company Size</InputLabel>
              <Select
                required
                labelId="company-size-label"
                id="companySize"
                name="companySize"
                value={company.companySize}
                label="Company Size"
                onChange={handleSelectChange}
              >
                {companySizeOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              fullWidth
              id="foundedYear"
              label="Founded Year"
              name="foundedYear"
              value={company.foundedYear}
              onChange={handleChange}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="logo"
              label="Company Logo URL"
              name="logo"
              value={company.logo}
              onChange={handleChange}
              variant="outlined"
              helperText="Enter a URL to the company logo image"
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="overview"
              label="Company Overview"
              name="overview"
              value={company.overview}
              onChange={handleChange}
              multiline
              rows={6}
              variant="outlined"
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={creating}
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 2,
                  fontSize: '1rem'
                }}
              >
                {creating ? <CircularProgress size={24} color="inherit" /> : "Create Company"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
