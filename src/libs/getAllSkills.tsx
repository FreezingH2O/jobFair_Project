import { CompanyJson } from "../../interface";

export default async function getAllSkills(): Promise<any> {
 
  // Fetch venues data from the API
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/positions/skills`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch positions skills');
  }
  
  return response.json();
}