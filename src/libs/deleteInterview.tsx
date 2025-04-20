import { InterviewItem } from "../../interface";
import { getSession } from "next-auth/react";
export default async function deleteInterview(interview: InterviewItem &  { _id: string }) {
    const session = await getSession();
    const response = await fetch(
        `${process.env.BACKEND_URL}/api/v1/interviews/${interview._id}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${session?.user?.token}`
            }
        }
    );
    
    if (!response.ok) {
        throw new Error("Failed to cancel interview");
    }
    return response.json();
}