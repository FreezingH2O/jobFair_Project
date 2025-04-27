
"use server"

import { revalidatePath } from "next/cache";

export async function refreshPositions() {
  revalidatePath('/position');
  revalidatePath('/company');
  revalidatePath('/interviewlist');
}
