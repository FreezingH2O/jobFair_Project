import { get } from "http";
import { CreateInterviewItem } from "../../interface";
import { getSession } from "next-auth/react";
export default async function createInterview(interviewData:CreateInterviewItem, companyId: string) {
    const session = await getSession();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies/${companyId}/interviews`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify(
                interviewData
            )
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create Interview");
    }

    return response.json();
}