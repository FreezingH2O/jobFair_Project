import { CompanyJson } from "../../interface";

export default async function getCompanies(): Promise<CompanyJson> {
 
  // Fetch venues data from the API
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/companies`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  
  return response.json();
}