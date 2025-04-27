import { PositionJson } from "../../interface";
export default async function getPositions(): Promise<PositionJson> {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/positions`);

    if (!response.ok) {
        throw new Error("Failed to fetch all positions");
    }

    return response.json();
}