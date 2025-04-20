import { CompanyItem } from "../../interface";
import { getSession } from "next-auth/react";
export default async function deleteCompany(cid:string) {
    const session = await getSession();
    const response = await fetch(
        `${process.env.BACKEND_URL}/api/v1/companies/${cid}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${session?.user?.token}`
            }
        }
    );
    
    if (!response.ok) {
        throw new Error("Failed to delete company");
    }
    return response.json();
}