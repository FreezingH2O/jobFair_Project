import Card from '@/components/CompanyCard';
import Link from 'next/link';
import { CompanyJson, CompanyItem } from '@/../../interface';
import RefreshButton from './RefreshButton';


interface CompanyCatalogProps {
  companyJson: CompanyJson;
  searchKey?: string | null;
  filterTags?: string[] | null;
}
export default function CompanyCatalog({
  companyJson,
  searchKey = null,
  filterTags = null,
}: CompanyCatalogProps) {

 // const companyJson = companyCatalogProps.companyJson;
 const filteredCompanies = companyJson.data.filter((company: CompanyItem) => {
  const matchesSearch =
    !searchKey ||
    company.name.toLowerCase().includes(searchKey.toLowerCase());

  const matchesTags =
    !filterTags || filterTags.length === 0 ||
    company.tags?.some((tag: string) =>
      filterTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
    );

  return matchesSearch && matchesTags;
});

  return (
    <>
      <h2 className="text-2xl text-gray-800 text-center mb-8">
        Explore {filteredCompanies.length} fabulous companies that you might be interested
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
      <div className="absolute top-32 right-60">
                  <RefreshButton />
                </div>
        {filteredCompanies.length === 0 ? 
          (
            <p className="text-center col-span-full">No matching companies found.</p>
          ) : (
            filteredCompanies.map((company: CompanyItem) => (
          <Link 
            href={`/company/${company._id}`} 
            className="w-full max-w-sm" 
            key={company._id}
          >
            <Card
              cid={company._id}
              companyName={company.name}
              description={company.description}
              telephone={company.tel}
              website={company.website}
              address={company.address}
            />
          </Link>
            ))
        )}
      </div>
    </>
  );
}
