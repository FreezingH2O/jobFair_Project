import { CompanyItem } from "../../interface";
import { getSession } from "next-auth/react";

export default async function updateCompany(company:CompanyItem){
    const session = await getSession();

    if (session?.user?.role !== "admin") {
        throw new Error("Not authenticated");
      }

    const response = await fetch(`
        ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies/${company._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify(company),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to update company");
    }

    return response.json();
}