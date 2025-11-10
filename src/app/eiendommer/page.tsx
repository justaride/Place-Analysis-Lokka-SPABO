import Container from '@/components/ui/Container';
import EiendomCard from '@/components/eiendom/EiendomCard';
import { lastAlleEiendommer } from '@/lib/eiendom-loader';

export const metadata = {
  title: 'Eiendommer',
  description: 'Oversikt over eiendommer i Løkka-området',
};

export default async function EiendommerPage() {
  const eiendommer = await lastAlleEiendommer();

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-gray-200 bg-gradient-to-br from-lokka-primary to-lokka-secondary py-12 text-white">
        <Container>
          <h1 className="mb-4 text-4xl font-bold">Eiendommer</h1>
          <p className="text-lg text-white/90">
            Utforsk placeanalyser og eiendomsinformasjon for eiendommer i
            Løkka-området
          </p>
        </Container>
      </section>

      {/* Properties Grid */}
      <Container className="py-12">
        {eiendommer.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">
              Ingen eiendommer funnet. Legg til din første eiendom ved å følge
              instruksjonene i dokumentasjonen.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-lokka-primary">
                {eiendommer.length} eiendom{eiendommer.length !== 1 ? 'mer' : ''}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eiendommer.map((eiendom) => (
                <EiendomCard key={eiendom.id} eiendom={eiendom} />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
