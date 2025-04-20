import { OnePositionJson } from "../../interface";

export default async function getPositionById(pid: string): Promise<OnePositionJson> {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/positions/${pid}`);

  if (!response.ok) {
    throw new Error("Failed to fetch the position details");
  }

  return response.json();
}