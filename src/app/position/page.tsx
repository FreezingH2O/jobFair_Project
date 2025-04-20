import PositionCatalog from '@/components/PositionCatalog';
import getPositions from '@/libs/getPositions';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Link from 'next/link';

export default async function PositionPage() {
  const positions = await getPositions();
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';
  return (
    <main className="min-h-screen">
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl text-gray-800 font-bold text-center mb-8">Find your Position</h1>
            <PositionCatalog positionJson={positions} />
          {isAdmin && (
            <div className="mt-8 flex justify-center">
              <Link href="/position/new" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg py-3 px-8 rounded-lg transition-colors shadow-md">
                Add New Position
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
