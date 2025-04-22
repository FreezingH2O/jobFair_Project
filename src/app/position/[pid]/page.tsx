import React, { use } from 'react';
import { notFound } from 'next/navigation';
import getPositionById from '@/libs/getPositionById';
import { Button } from '@mui/material';
import Link from 'next/link';
import { PositionItem } from '@/../../interface';
import { OnePositionJson } from '@/../../interface';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import DeletePositionButton from '@/components/DeletePositionButton';
import dayjs from 'dayjs';

function formatDate(dateString: string){
    return dayjs(dateString).format("MMMM D, YYYY");
};

// Define the props for the page component
type PositionDetailPageProps = {
  params: {
    pid: string;
  };
};

export default async function PositionDetailPage({ params }: PositionDetailPageProps) {
  const { pid } = params;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'admin';
  
  
  try {
    const positionResponse:OnePositionJson = await getPositionById(pid);
    const position:PositionItem = positionResponse.data;
    
    if (!position) {
      return notFound();
    }
    
    return (
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{position.title}</h1>
            <h2 className="text-lg text-gray-600 mb-4">{position.company.name}</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description:</h3>
              <p className="text-gray-600 mb-4">{position.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Responsibilities:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
                {position.responsibilities && position.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Requirements:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
                {position.requirements && position.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>


               <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {position.skill &&
                      position.skill.map((skillone, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {skillone}
                        </span>
                      ))}
                  </div>
                </div>

            {/* Salary Range */}
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Salary Range
                </h2>
                <div className="flex gap-2 text-sm font-medium text-green-800">
                  <span className="bg-green-100 px-3 py-1 rounded-full">
                    Min: {position.salary.min.toLocaleString()} ฿
                  </span>
                  <span className="bg-green-100 px-3 py-1 rounded-full">
                    Max: {position.salary.max.toLocaleString()} ฿
                  </span>
                </div>
              </div>


            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <h4 className="font-medium text-gray-700">Work Arrangement</h4>
                </div>
                <p className="text-gray-600 pl-7">{position.workArrangement}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <h4 className="font-medium text-gray-700">Location</h4>
                </div>
                <p className="text-gray-600 pl-7">{position.location}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <h4 className="font-medium text-gray-700">Interview Date</h4>
                </div>
                <p className="text-gray-600 pl-7">{formatDate(position.interviewStart)} to <br />{formatDate(position.interviewEnd)}</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <Link 
                href={{
                  pathname: '/interview',
                }}
                className="w-full md:w-auto"
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    width: { xs: '100%', md: '350px' }
                  }}
                >
                  Apply Now
                </Button>
              </Link>
              
              <Link 
                href={{
                  pathname: `/company/${position.company._id}`
                }}
                className="w-full md:w-auto"
              >
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    width: { xs: '100%', md: '350px' }
                  }}
                >
                  View Company
                </Button>
              </Link>
            </div>
            
            {isAdmin && (
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Link 
                  href={{
                    pathname: `/position/${position._id}/edit`,
                  }}
                  className="w-full md:w-auto"
                >
                  <Button 
                    variant="contained" 
                    color="info" 
                    sx={{ 
                      textTransform: 'none',
                      fontSize: '1rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      width: { xs: '100%', md: '350px' }
                    }}
                  >
                    Edit Position
                  </Button>
                </Link>
                
                <DeletePositionButton pid={pid} />
              </div>
            )} 
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching position details:", error);
    return notFound();
  }
}
