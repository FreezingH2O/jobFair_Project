import { getSession } from "next-auth/react";
import { CreateCompanyItem } from "../../interface";

export default async function createCompany(company: CreateCompanyItem) {
  try {
    const session = await getSession();
    if (session?.user?.role !== "admin") {
      throw new Error("Not authenticated");
    }
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.user?.token}`
      },
      body: JSON.stringify(company),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create company");
    }
console.log(response.json)
    return await response.json();
  } catch (error) {
    console.log(error)
    console.error("Error creating company:", error);
    throw error;
  }
}
