// PositionCatalog.tsx
import Card from '@/components/PositionCard';
import Link from 'next/link';
import { PositionJson, PositionItem } from '@/../../interface';
import RefreshButton from './RefreshButton'; // Import the client component

type PositionCatalogProps = {
  positionJson: PositionJson;
};

export default async function PositionCatalog(positionProp:PositionCatalogProps) {
  const positionJson = positionProp.positionJson;
  
  return (
    <div className="relative">
      {/* Add the refresh button in the top right */}
      <div className="absolute top-0 right-0">
        <RefreshButton />
      </div>
      
      <h2 className="text-2xl text-gray-800 text-center mb-8 pt-10">
        Explore {positionJson.count} amazing positions that you might be interested
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {positionJson.data.map((position: PositionItem) => (
          <Link 
            href={`/position/${position._id}`} 
            className="w-full max-w-sm" 
            key={position._id}
          >
            <Card
              title={position.title}
              company={position.company.name}
              workArrangement={position.workArrangement}
              location={position.location}
              interviewStart={position.interviewStart}
              interviewEnd={position.interviewEnd}
              openingPosition={position.openingPosition}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
