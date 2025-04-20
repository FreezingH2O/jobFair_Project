import { OneCompanyJson } from '@/../../interface';
export default async function getCompany(cid: string): Promise<OneCompanyJson> {

  // Fetch venue data by ID from the API
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/companies/${cid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store",
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch company');
  }
  
  return response.json();
}
