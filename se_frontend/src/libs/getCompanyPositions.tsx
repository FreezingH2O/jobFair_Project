import { PositionJson } from "../../interface";

export default async function getCompanyPositions(companyId: string): Promise<PositionJson> {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/company/${companyId}/positions`);

    if (!response.ok) {
        throw new Error("Failed to fetch the company positions");
    }

    return response.json();
}