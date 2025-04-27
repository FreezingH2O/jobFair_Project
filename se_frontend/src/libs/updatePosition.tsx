import { getSession } from "next-auth/react";
import { PositionItem } from "../../interface";

export default async function updatePosition(position:PositionItem) {
    const session = await getSession();
    if(session?.user?.role !== "admin") {
        throw new Error("Not authenticated");
    }
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/positions/${position._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user?.token}`
    },
    body: JSON.stringify(position),
  });

  if (!response.ok) {
    throw new Error("Failed to update the position");
  }

  return response.json();
}