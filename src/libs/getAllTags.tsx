import { CompanyJson } from "../../interface";

export default async function getAllTags(): Promise<any> {
 
  // Fetch venues data from the API
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/companies/tags`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  
  return response.json();
}