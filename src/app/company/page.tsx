import CompanyCatalog from "@/components/CompanyCatalog";
import getCompanies from "@/libs/getCompanies";
import { Button } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import Link from "next/link"; // Import Link from Next.js, not Lucide React

export default async function CompanyPage() {
  const companies = await getCompanies();
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen">
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl text-gray-800 font-bold text-center mb-8">
            Find your company
          </h1>
          <CompanyCatalog CompanyJson={companies} />
          
          {/* Add Button Here */}
          <div className="flex justify-center mt-8">
            {session?.user?.role === "admin" ? (
              <Link href="/company/new" passHref>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#157efb",
                    borderRadius: 3,
                    fontSize: "1rem",
                    py: 1,
                    px: 3,
                  }}
                >
                  Add New Company
                </Button>
              </Link>
            ) : ""}
          </div>
        </div>
      </section>
    </main>
  );
}
