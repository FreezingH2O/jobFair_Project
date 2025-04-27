import { CompanyJson } from "../../interface";

export default async function getCompanies(): Promise<CompanyJson> {
 
  // Fetch venues data from the API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies?limit=1000`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  
  return response.json();
}