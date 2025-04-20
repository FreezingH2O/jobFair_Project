// src/app/book-interview/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import DateInterview from "@/components/DateInterview";
import { toast, Toaster } from "react-hot-toast";
import createInterview from "@/libs/createInterview";
import getCompanyPositions from "@/libs/getCompanyPositions";
import { PositionItem } from "@/../../interface";
import { InputLabel, MenuItem, Select } from "@mui/material";

export default function BookInterviewPage() {
  const [company, setCompany] = useState<{ _id?: string; id?: string } | string>("");
  const [interviewDate, setInterviewDate] = useState<Date | null>(null);
  const [position, setPosition] = useState("");
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch positions when company changes
  useEffect(() => {
    const fetchPositions = async () => {
      if (!company) {
        setPositions([]);
        return;
      }
      
      const companyId = typeof company === "object" ? company._id ?? company.id : company;
      
      if (!companyId) {
        return;
      }
      setLoadingPositions(true);
      try {
        const response = await getCompanyPositions(companyId);
        if (response.success && Array.isArray(response.data)) {
          setPositions(response.data);
        } else {
          toast.error("Failed to load positions");
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Failed to load positions");
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, [company]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!company || !interviewDate) {
      toast.error("Please select both company and interview date");
      return;
    }
    const companyId = typeof company === "object" ? company._id ?? company.id : company;
    if (!companyId) {
      throw new Error("Company ID is required but was not provided.");
    }
  
    // console.log("Company value:", company); // Debug what's being received
    // console.log("Using company ID:", companyId); // Debug what's being used
    // console.log("Position selected:", position); // Debug the position

    setIsSubmitting(true);
    
    try {
      // Format the interview data
      const formattedDate = dayjs(interviewDate).format("YYYY-MM-DD");
      
      const interviewData = {
        interviewDate: formattedDate,
        position: position,
      };
      
      await createInterview(interviewData, companyId);

      // Show success message
      toast.success("Interview scheduled successfully!");
      
      // Reset form
      setCompany("");
      setInterviewDate(null);
      setPosition("");
      
      // Redirect to my interviews page after short delay
      setTimeout(() => {
        router.push("/interviewlist");
      }, 2000);
      
    } catch (error) {
      console.error("Error appointing interview:", error);
      toast.error((error as Error).message || "Failed to schedule interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Toaster position="top-center" />
      
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Career Opportunity</div>
            <h1 className="block mt-1 text-2xl leading-tight font-bold text-black mb-6">Schedule an Interview (Up to 3 Interviews)</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <DateInterview 
              onDateChange={(date: Date | null) => setInterviewDate(date)}
              onCompanyChange={(companyId: string) => setCompany(companyId)}
              />

             {/* Position select dropdown */}
             <div>
                <InputLabel id="position-label" className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </InputLabel>
                <Select
                  labelId="position-label"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full"
                  variant="standard"
                  displayEmpty
                  required
                  disabled={!company || loadingPositions}
                >
                  <MenuItem value="" disabled>
                    {!company 
                      ? "Select a company first" 
                      : loadingPositions 
                        ? "Loading positions..." 
                        : "Select a position"}
                  </MenuItem>
                  
                  {loadingPositions ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} /> Loading positions...
                    </MenuItem>
                  ) : positions.length > 0 ? (
                    positions.map((pos) => (
                      <MenuItem key={pos._id} value={pos._id}>
                        {pos.title}
                      </MenuItem>
                    ))
                  ) : company ? (
                    <MenuItem disabled>No positions available for this company</MenuItem>
                  ) : null}
                </Select>
              </div>
              
              <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <CircularProgress size={20} color="inherit" className="mr-2" />
                  <span>Scheduling...</span>
                </div>
                ) : (
                "Schedule Interview"
                )}
              </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/my-interviews")}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View my scheduled interviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
