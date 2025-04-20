import { getSession } from "next-auth/react";
import { CreateCompanyItem } from "../../interface";
export default async function createCompany(company: CreateCompanyItem){
    const session = await getSession();
    if(session?.user?.role !== "admin") {
        throw new Error("Not authenticated");
    }
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/companies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify(company),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create company");
    }
    
    return response.json();
}