import { CreatePositionItem } from "../../interface";
import { getSession } from "next-auth/react";

export default async function createPosition(positionData: CreatePositionItem) {
    const session = await getSession();
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/company/${positionData.company}/positions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify(positionData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create position");
    }
    
    return response.json();
}