import { getSession } from "next-auth/react";

export default async function deletePosition(pid: string) {
  const session = await getSession();
  
  if (!session || !session.user?.token) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/positions/${pid}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session.user.token}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`Failed to delete the position: ${response.status} ${errorData ? JSON.stringify(errorData) : response.statusText}`);
  }

  return response.json();
}
