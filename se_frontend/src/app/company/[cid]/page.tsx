import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import getCompany from "@/libs/getCompany";
import getCompanyPositions from "@/libs/getCompanyPositions";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/api/auth/[...nextauth]/authOptions";
import { Box, Card, Stack, Typography, Button } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationIcon from "@mui/icons-material/LocationOn";
import CalendarIcon from "@mui/icons-material/DateRange";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import dayjs from "dayjs";
import { PositionItem } from "../../../../interface";
import DeleteCompanyButton from "@/components/DeleteCompanyButton";

type CompanyDetailPageProps = {
  params: {
    cid: string;
  };
};

function formatDate(dateString: string) {
  return dayjs(dateString).format("MMMM D, YYYY");
}
function convertGoogleDriveUrl(url: string) {
  const match = url.match(/\/d\/(.+?)\/view/);
  if (!match) return url;
  const fileId = match[1];
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { cid } = params;

  try {
    const companyResponse = await getCompany(cid);
    const company = companyResponse.data;
    const session = await getServerSession(authOptions);
    const positionsResponse = await getCompanyPositions(cid);
    const positions = positionsResponse.data;
    const imageUrl = convertGoogleDriveUrl(company.logo);

    if (!company) {
      return notFound();
    } else if (!positions) {
      return notFound();
    }

    if (session?.user?.role === "admin") {
      return (
        <main className="min-h-screen p-4 md:p-8 bg-gray-50">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative h-64 md:h-auto w-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                  <Image
                    src={imageUrl}
                    alt={company.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-tl-lg rounded-bl-lg"
                  />
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {company.name}
                </h1>

                {company.address && (
                  <div className="flex items-start mb-3">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-gray-600">{company.address}</p>
                  </div>
                )}

                {company.tel && (
                  <div className="flex items-center mb-3">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p className="text-gray-600">{company.tel}</p>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center mb-4">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                      Description
                    </h2>
                    <p className="text-gray-600">{company.description}</p>
                  </div>
                )}

                {/* Company Industry */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Industry
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {company.tags &&
                      company.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Company Size
                  </h2>
                  <p className="text-gray-600">{company.companySize}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Founded
                  </h2>
                  <p className="text-gray-600">{company.foundedYear}</p>
                </div>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Link href={{ pathname: `/company/${cid}/edit` }}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#157efb",
                        borderRadius: 3,
                        fontSize: "1rem",
                        py: 1,
                        px: 2,
                      }}
                    >
                      Edit Company
                    </Button>
                  </Link>
                  <DeleteCompanyButton companyId={cid}/>
                </Stack>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Company Overview
              </h2>

              <div>
                <p className="text-lg text-gray-700 mb-2">{company.overview}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mt-6 text-center mb-4">
              Opening Positions
            </h2>
          </div>

          <div className="max-w-5xl mx-auto overflow-hidden mb-8">
            {positions && positionsResponse.count > 0 ? (
              positions.map((position: PositionItem) => (
                <Card
                  key={position._id} // Don't forget to add a key prop for React lists
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: "10px",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        mb={2}
                        color="text.primary"
                      >
                        {position.title}
                      </Typography>

                      <Stack direction="row" spacing={2} mb={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <BusinessIcon fontSize="small" />
                          <Typography variant="body1">
                            {position.workArrangement}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon fontSize="small" />
                          <Typography variant="body1">
                            {position.location}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <CalendarIcon fontSize="small" />
                        <Typography variant="body1">
                          {formatDate(position.interviewStart)} -{" "}
                          {formatDate(position.interviewEnd)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={5}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          bgcolor: "#ececec",
                          borderRadius: "20px",
                          px: 3,
                          py: 1.5,
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          textAlign="center"
                        >
                          {position.openingPosition} Openings
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          bgcolor: "#1976d2",
                          borderRadius: "50%",
                          width: 60,
                          height: 60,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link href={{ pathname: `/position/${position._id}` }}>
                          <Button>
                            <ArrowOutwardIcon
                              sx={{ color: "white", fontSize: 28 }}
                            />
                          </Button>
                        </Link>
                      </Box>
                    </Stack>
                  </Stack>
                </Card>
              ))
            ) : (
              <Typography variant="h6" textAlign="center" py={4} color='text.primary'>
                No opening positions available
              </Typography>
            )}
          </div>
          <div className="flex justify-center">
          <Link href="/position/new" passHref style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#157efb",
                borderRadius: 3,
                fontSize: "1rem",
                py: 1,
                px: 2,
              }}
            >
              Add New Position
            </Button>
          </Link>
          </div>
        </main>
      );
    } else {
      return (
        <main className="min-h-screen p-4 md:p-8 bg-gray-50">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative h-64 md:h-auto w-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                  <Image
                    src={imageUrl}
                    alt={company.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-tl-lg rounded-bl-lg"
                  />
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {company.name}
                </h1>

                {company.address && (
                  <div className="flex items-start mb-3">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-gray-600">{company.address}</p>
                  </div>
                )}

                {company.tel && (
                  <div className="flex items-center mb-3">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p className="text-gray-600">{company.tel}</p>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center mb-4">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                      Description
                    </h2>
                    <p className="text-gray-600">{company.description}</p>
                  </div>
                )}

                {/* Company Industry */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Industry
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {company.tags &&
                      company.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Company Size
                  </h2>
                  <p className="text-gray-600">{company.companySize}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Founded
                  </h2>
                  <p className="text-gray-600">{company.foundedYear}</p>
                </div>

                <Link href={{ pathname: "/interview" }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#157efb",
                      borderRadius: 3,
                      fontSize: "1rem",
                      py: 1,
                      px: 2,
                    }}
                  >
                    Schedule Interview
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Company Overview
              </h2>

              <div>
                <p className="text-lg text-gray-700 mb-2">{company.overview}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mt-6 text-center mb-4">
              Opening Positions
            </h2>
          </div>

          <div className="max-w-5xl mx-auto overflow-hidden mb-8">
            {positions && positionsResponse.count > 0 ? (
              positions.map((position: PositionItem) => (
                <Card
                  key={position._id} // Don't forget to add a key prop for React lists
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: "10px",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        mb={2}
                        color="text.primary"
                      >
                        {position.title}
                      </Typography>

                      <Stack direction="row" spacing={2} mb={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <BusinessIcon fontSize="small" />
                          <Typography variant="body1">
                            {position.workArrangement}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon fontSize="small" />
                          <Typography variant="body1">
                            {position.location}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <CalendarIcon fontSize="small" />
                        <Typography variant="body1">
                          {formatDate(position.interviewStart)} -{" "}
                          {formatDate(position.interviewEnd)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={5}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          bgcolor: "#ececec",
                          borderRadius: "20px",
                          px: 3,
                          py: 1.5,
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          textAlign="center"
                        >
                          {position.openingPosition} Openings
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          bgcolor: "#1976d2",
                          borderRadius: "50%",
                          width: 60,
                          height: 60,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link href={{ pathname: `/position/${position._id}` }}>
                          <Button>
                            <ArrowOutwardIcon
                              sx={{ color: "white", fontSize: 28 }}
                            />
                          </Button>
                        </Link>
                      </Box>
                    </Stack>
                  </Stack>
                </Card>
              ))
            ) : (
              <Typography variant="h6" textAlign="center" py={4} color='text.primary'>
                No opening positions available
              </Typography>
            )}
          </div>
        </main>
      );
    }
  } catch (error) {
    console.error("Error fetching company details:", error);
    return notFound();
  }
}