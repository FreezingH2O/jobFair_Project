"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { CompanyJson, CompanyItem, InterviewJson, InterviewItem, PositionItem } from "../../interface";
import getCompanies from "@/libs/getCompanies";
import getInterviews from "@/libs/getInterviews";
import getUserProfile from "@/libs/getUserProfile";
import deleteInterview from "@/libs/deleteInterview";
import updateInterview from "@/libs/updateInterview";

// Define a type for user data
interface UserData {
  _id: string;
  name: string;
  email: string;
  tel?: string;
  role?: string;
}

// RefreshButton component
function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };
  
  return (
    <button
      onClick={handleRefresh}
      className="p-2 m-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md"
      disabled={isRefreshing}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
    </button>
  );
}

export default function InterviewList() {
  const [interviews, setInterviews] = useState<(InterviewItem & { _id: string, user: string , position: PositionItem})[]>([]);
  const [companies, setCompanies] = useState<{[key: string]: CompanyItem}>({});
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<(InterviewItem & { _id: string, user: string }) | null>(null);
  const [newInterviewDate, setNewInterviewDate] = useState<dayjs.Dayjs | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [session, status]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.token) return;
    
    try {
      const profile = await getUserProfile(session.user.token);
      setUserData(profile.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [session, status]);

  // Fetch companies for reference
  const fetchCompanies = useCallback(async () => {
    if (status !== "authenticated") return;
    
    try {
      const data: CompanyJson = await getCompanies();
      
      // Create a map of company ID to company object for easy lookup
      const companiesMap: {[key: string]: CompanyItem} = {};
      data.data.forEach(company => {
        companiesMap[company._id] = company;
      });
      
      setCompanies(companiesMap);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }, [status]);

  // Fetch user's interviews
  const fetchInterviews = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.token || dataLoaded) return;
    
    setLoading(true);
    
    try {
      // Get interviews - the API will handle filtering based on user role
      const interviewsData: InterviewJson = await getInterviews(session.user.token);
      
      // Process the interviews
      const processedInterviews = interviewsData.data.map(interview => {
        // Cast to access _id and handle populated company object if available
        const interviewWithId = {
          ...interview,
          _id: (interview as any)._id,
          user: (interview as any).user
        };
        
        // If interview.company is an object with name (populated), store it in companies map
        if (typeof interview.company === 'object' && interview.company !== null) {
          const companyData = interview.company as unknown as CompanyItem;
          if (companyData._id) {
            setCompanies(prev => ({
              ...prev,
              [companyData._id]: companyData
            }));
          }
          // Normalize the company field to be just the ID string for consistency
          interviewWithId.company._id = companyData._id || interview.company._id as string;
        }
        
        return interviewWithId;
      });
      
      // Sort interviews by date (newest first)
      processedInterviews.sort((a, b) => 
        new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime()
      );
      
      setInterviews(processedInterviews);
      
      // If we don't have company data for some interviews, fetch all companies
      const missingCompanyIds = processedInterviews
        .filter(interview => !companies[interview.company._id])
        .map(interview => interview.company);
        
      if (missingCompanyIds.length > 0) {
        const companiesData = await getCompanies();
        
        // Update companies map
        const newCompaniesMap = { ...companies };
        companiesData.data.forEach((company: CompanyItem) => {
          newCompaniesMap[company._id] = company;
        });
        
        setCompanies(newCompaniesMap);
      }
      
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  }, [session, status, companies, dataLoaded]);

  // Initial data loading
  useEffect(() => {
    if (status === "authenticated" && !dataLoaded) {
      fetchUserProfile();
      fetchCompanies();
      fetchInterviews();
    }
  }, [status, fetchUserProfile, fetchCompanies, fetchInterviews, dataLoaded]);

  const handleCancelInterview = async (interview: InterviewItem & { _id: string }) => {
    try {
      await deleteInterview(interview);

      // Remove the cancelled interview from state
      setInterviews(interviews.filter(item => item._id !== interview._id));
      
      toast.success("Interview cancelled successfully");
    } catch (error) {
      console.error("Error cancelling interview:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to cancel interview");
      } else {
        toast.error("Failed to cancel interview");
      }
    }
  };

  const handleEditInterview = (interview: InterviewItem & { _id: string, user: string }) => {
    setEditingInterview(interview);
    setNewInterviewDate(dayjs(interview.interviewDate));
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingInterview || !newInterviewDate) return;

    try {
      await updateInterview(editingInterview, newInterviewDate);
      
      // Update the interview in state
      const updatedInterviews = interviews.map(interview => {
        if (interview._id === editingInterview._id) {
          return {
            ...interview,
            interviewDate: newInterviewDate.format("YYYY-MM-DD")
          };
        }
        return interview;
      });
      
      setInterviews(updatedInterviews);
      setEditDialogOpen(false);
      setEditingInterview(null);
      
      toast.success("Interview updated successfully");
    } catch (error) {
      console.error("Error updating interview:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update interview");
      } else {
        toast.error("Failed to update interview");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMMM D, YYYY");
  };

  // Show loading state while checking authentication
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view interviews</p>
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Sign In
        </button>
      </div>
    );
  }
  console.log(editingInterview)

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="absolute top-0 right-0">
        <RefreshButton />
      </div>
      
      <Toaster position="top-center" />
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-indigo-600">
          <h1 className="text-xl font-bold text-white">
            {isAdmin ? "All Interviews (Admin View)" : "My Interviews"}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-indigo-100">
            {isAdmin 
              ? "Manage all interview across the system" 
              : "Your scheduled interviews with companies"
            }
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          {interviews.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {interviews.map((interview) => (
                <li key={interview._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="sm:flex sm:justify-between w-full">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {interview.company.name}
                        </h3>
                        {/* User Email - Only shown for admin */}
                        {isAdmin && (
                          <div className="mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg 
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              <span>User: {interview.user.email || "Unknown User"}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500 mt-1 ml-6.5">
                          <svg 
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          <span>Position: {interview.position.title}</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg 
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          <span>Interview Date: <time dateTime={interview.interviewDate}>{formatDate(interview.interviewDate)}</time></span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg 
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          <span>Schedule on: {formatDate(interview.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
                        <button
                          onClick={() => handleEditInterview(interview)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Edit Interview
                        </button>
                        <button
                          onClick={() => handleCancelInterview(interview)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel Interview
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                {isAdmin 
                  ? "There are no interviews in the system yet." 
                  : "You haven't scheduled any interviews yet."
                }
              </p>
              {!isAdmin && (
                <div className="mt-6">
                  <Link
                    href="/interview"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Schedule an Interview
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!isAdmin && (
        <div className="mt-6 text-center">
          <Link
            href="/interview"
            className="text-indigo-600 hover:text-indigo-900"
          >
            Appoint another interview
          </Link>
        </div>
      )}

      {/* Edit Interview Dialog */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Interview</DialogTitle>
          <DialogContent>
            <div className="my-4">
              <p className="mb-2 text-gray-700">
                Company: {editingInterview ? companies[editingInterview.company._id]?.name : ""}
              </p>
              <p className="mb-4 text-gray-700">
                Current Date: {editingInterview ? formatDate(editingInterview.interviewDate) : ""}
              </p>
              <div className="mt-4">
                <p className="mb-2 text-gray-700">Select New Date:</p>
                <DatePicker
                    value={newInterviewDate}
                    onChange={(newValue) => setNewInterviewDate(newValue)}
                    disablePast
                    minDate={editingInterview ? dayjs(editingInterview.position.interviewStart) : undefined}
                      maxDate={editingInterview ? dayjs(editingInterview.position.interviewEnd) : undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined"
                      }
                    }}
                  />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              color="primary"
              disabled={!newInterviewDate}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </div>
  );
}
