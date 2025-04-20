"use client";
import { useState, useEffect } from "react";
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
import getCompany from "@/libs/getCompany";
import updateCompany from "@/libs/updateCompany";
import { CompanyItem } from "../../../../../interface";

// Company size options based on your schema
const companySizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

export default function EditCompany({ params }: { params: { cid: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [company, setCompany] = useState<CompanyItem>({
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
  });

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const data = await getCompany(params.cid);
          setCompany(data.data);
        } catch (error) {
          console.error("Error fetching company:", error);
          toast.error("Failed to load company data");
        } finally {
          setLoading(false);
        }
      }
    };

    if (params.cid) {
      fetchCompany();
    }
  }, [params.cid, status]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
    
    if (!company.name || !company.address) {
      toast.error("Company name and address are required");
      return;
    }
    
    try {
      setUpdating(true);
      await updateCompany(company);
      toast.success("Company updated successfully");
      router.push("/company");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
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
          Edit Company
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
              fullWidth
              id="website"
              label="Website"
              name="website"
              value={company.website}
              onChange={handleChange}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="about"
              label="About"
              name="about"
              value={company.about}
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
            />
            
            {/* Replace TextField with Select for companySize */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="company-size-label">Company Size</InputLabel>
              <Select
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
              label="Company Logo"
              name="logo"
              value={company.logo}
              onChange={handleChange}
              variant="outlined"
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
            disabled={updating}
            sx={{ 
                py: 1.5, 
                px: 4, 
                borderRadius: 2,
                fontSize: '1rem'
            }}
            >
            {updating ? <CircularProgress size={24} color="inherit" /> : "Update Company"}
            </Button>
        </Box>
          </Box>
        </Paper>
      </Container>
        
    </Box>
  );
}
