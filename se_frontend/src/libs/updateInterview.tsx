import { InterviewItem } from "../../interface";
import { Dayjs } from "dayjs";
import { getSession } from "next-auth/react";

export default async function updateInterview(editingInterview: InterviewItem, newInterviewDate:Dayjs) {
    const session = await getSession();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies/${editingInterview.company}/interviews/${editingInterview._id}`,
        {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify({
            interviewDate: newInterviewDate.format("YYYY-MM-DD")
        })
        }
    );
    
    if (!response.ok) {
        throw new Error("Failed to update interview");
    }
 return response.json();
}