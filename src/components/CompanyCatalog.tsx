import Card from '@/components/CompanyCard';
import Link from 'next/link';
import { CompanyJson, CompanyItem } from '@/../../interface';
import RefreshButton from './RefreshButton';


interface CompanyCatalogProps {
  CompanyJson: CompanyJson;
}
export default async function CompanyCatalog(companyCatalogProps:CompanyCatalogProps) {

  const companyJson = companyCatalogProps.CompanyJson;
  return (
    <>
      <h2 className="text-2xl text-gray-800 text-center mb-8">
        Explore {companyJson.count} fabulous companies that you might be interested
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
      <div className="absolute top-32 right-60">
                  <RefreshButton />
                </div>
        {companyJson.data.map((company: CompanyItem) => (
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
        ))}
      </div>
    </>
  );
}
