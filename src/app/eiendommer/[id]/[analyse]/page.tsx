import { notFound } from 'next/navigation';
import { lastEiendom, hentAlleEiendomsIder } from '@/lib/eiendom-loader';
import Container from '@/components/ui/Container';
import AnalyseNavigation from '@/components/eiendom/AnalyseNavigation';
import TabbedImageViewer from '@/components/eiendom/TabbedImageViewer';
import KeyMetrics from '@/components/eiendom/KeyMetrics';
import EiendomsprofilExpander from '@/components/eiendom/EiendomsprofilExpander';
import AktorListe from '@/components/eiendom/AktorListe';
import FadeIn from '@/components/ui/FadeIn';
import Link from 'next/link';
import Image from 'next/image';
import { formaterDato } from '@/lib/utils';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface PageProps {
  params: Promise<{
    id: string;
    analyse: string;
  }>;
}

// Valid analysis types
const VALID_ANALYSES = ['5min-gange', '1min-gange'];

export async function generateStaticParams() {
  const ids = await hentAlleEiendomsIder();
  const params = [];

  for (const id of ids) {
    // For now, only generate routes for sofienberggata-6
    if (id === 'sofienberggata-6') {
      params.push({ id, analyse: '5min-gange' });
      params.push({ id, analyse: '1min-gange' });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { id, analyse } = await params;
  const eiendom = await lastEiendom(id);

  if (!eiendom || !VALID_ANALYSES.includes(analyse)) {
    return {
      title: 'Analyse ikke funnet',
    };
  }

  const analyseTitle = analyse === '5min-gange' ? '5 minutters gange' : '1 minutt gange';

  return {
    title: `${eiendom.adresse} - ${analyseTitle}`,
    description: `${analyseTitle} analyse for ${eiendom.adresse}`,
  };
}

export default async function AnalysePage({ params }: PageProps) {
  const { id, analyse } = await params;
  const eiendom = await lastEiendom(id);

  if (!eiendom || !VALID_ANALYSES.includes(analyse)) {
    notFound();
  }

  // Load aktør data if available for this property
  let aktorData = null;
  let totalRevenue = 0;
  let topCategory = '';
  try {
    const aktorPath = join(process.cwd(), 'src', 'data', 'aktorer', `${id}.json`);
    const aktorJson = await readFile(aktorPath, 'utf-8');
    aktorData = JSON.parse(aktorJson);

    // Calculate total revenue
    if (aktorData?.actors) {
      totalRevenue = aktorData.actors.reduce((sum: number, actor: any) =>
        sum + (actor.omsetning || 0), 0
      );
    }

    // Find top category by count
    if (aktorData?.categoryStats) {
      const topCategoryEntry = Object.entries(aktorData.categoryStats)
        .sort((a: any, b: any) => b[1].count - a[1].count)[0];
      topCategory = topCategoryEntry ? topCategoryEntry[0] : '';
    }
  } catch (error) {
    // Aktør data is optional - no error if file doesn't exist
  }

  // Find the specific analysis or create from legacy data
  let currentAnalyse = eiendom.plaaceAnalyses?.find(a => a.id === analyse);

  // If no plaaceAnalyses array or analysis not found, check if we should fall back to plaaceData
  if (!currentAnalyse) {
    // For 5min-gange, we can use the legacy plaaceData as fallback
    if (analyse === '5min-gange' && eiendom.plaaceData) {
      // Create a temporary analysis from plaaceData
      currentAnalyse = {
        id: '5min-gange',
        tittel: '5 minutters gange',
        beskrivelse: 'Plaace-analyse basert på 5 minutters gangeavstand',
        parametere: {
          gangeavstand: '5 minutter',
          transporttype: 'gange' as const
        },
        rapportDato: eiendom.plaaceData.rapportDato,
        screenshots: eiendom.plaaceData.screenshots,
        nokkeldata: eiendom.plaaceData.nokkeldata,
        demografi: eiendom.plaaceData.demografi,
        marked: eiendom.plaaceData.marked
      };
    } else {
      // Otherwise, page not found
      notFound();
    }
  }

  return (
    <>
      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-gray-200/30 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 py-8 text-white md:py-16">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-50 mix-blend-overlay" />

        <Container>
          <FadeIn direction="down">
            <div className="relative mb-4 md:mb-6">
              <Link
                href="/eiendommer"
                className="inline-flex items-center gap-2 text-xs text-white/80 transition-colors hover:text-white md:text-sm"
              >
                <span>←</span> Tilbake til oversikt
              </Link>
            </div>
          </FadeIn>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
            {/* Text Content */}
            <div className="flex-1">
              <FadeIn delay={100} direction="up">
                <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:mb-6 md:text-5xl lg:text-6xl">
                  {eiendom.adresse}
                </h1>
              </FadeIn>
              <FadeIn delay={200} direction="up">
                <div className="mb-4 rounded-lg bg-white/10 px-4 py-2 backdrop-blur md:mb-6">
                  <p className="text-lg font-semibold md:text-xl">
                    {currentAnalyse.tittel}
                  </p>
                  {currentAnalyse.beskrivelse && (
                    <p className="mt-1 text-sm text-white/80">
                      {currentAnalyse.beskrivelse}
                    </p>
                  )}
                </div>
              </FadeIn>
              {eiendom.beskrivelse && (
                <FadeIn delay={300} direction="up">
                  <p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/90 md:mb-6 md:text-base">
                    {eiendom.beskrivelse}
                  </p>
                </FadeIn>
              )}
              <FadeIn delay={400} direction="up">
                <div className="flex flex-wrap gap-2 text-xs md:gap-3 md:text-sm">
                  <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur md:px-4 md:py-2">
                    <span className="font-semibold">Gnr/Bnr:</span> {eiendom.gnr}/{eiendom.bnr}
                  </div>
                  <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur md:px-4 md:py-2">
                    <span className="font-semibold">Rapport:</span>{' '}
                    {formaterDato(currentAnalyse.rapportDato)}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Property Image */}
            {eiendom.heroImage && (
              <FadeIn delay={500} direction="right">
                <div className="flex-shrink-0">
                  <div className="relative h-48 w-48 overflow-hidden rounded-2xl shadow-large ring-2 ring-white/20 md:h-64 md:w-64 lg:h-72 lg:w-72">
                    <Image
                      src={eiendom.heroImage}
                      alt={eiendom.adresse}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-110"
                      quality={85}
                    />
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </Container>
      </section>

      {/* Analysis Navigation */}
      <AnalyseNavigation
        propertyId={id}
        analyses={eiendom.plaaceAnalyses || []}
        currentAnalyseId={analyse}
      />

      {/* Key Metrics Section */}
      <KeyMetrics
        energyRating={currentAnalyse.nokkeldata?.energimerke}
        buildingArea={currentAnalyse.nokkeldata?.areal}
        totalRevenue={totalRevenue}
        totalActors={aktorData?.metadata?.totalActors}
        topCategory={topCategory}
      />

      {/* Location Section */}
      {(eiendom.mapImage || eiendom.coordinates) && (
        <section className="border-b border-gray-200/30 bg-white py-8 md:py-16">
          <Container>
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary md:mb-8 md:text-3xl">Beliggenhet</h2>

            {eiendom.coordinates && (
              <div className="mb-6 h-[300px] overflow-hidden rounded-xl shadow-medium md:mb-8 md:h-[400px] md:rounded-2xl">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${eiendom.coordinates.lat},${eiendom.coordinates.lng}&zoom=18&maptype=satellite`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Google Maps - ${eiendom.adresse}`}
                />
              </div>
            )}

            {eiendom.mapImage && (
              <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <div className="relative h-[200px] overflow-hidden rounded-xl shadow-medium md:h-[250px] md:rounded-2xl">
                    <Image
                      src={eiendom.mapImage}
                      alt={`Kartuttak ${eiendom.adresse}`}
                      fill
                      className="object-contain"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-lokka-secondary md:mt-3 md:text-sm">
                    Kartuttak fra området
                  </p>
                </div>
                <div className="md:col-span-2">
                  <div className="rounded-xl border border-gray-200/50 bg-lokka-light/30 p-4 md:rounded-2xl md:p-6">
                    <h3 className="mb-2 text-base font-bold text-lokka-primary md:mb-3 md:text-lg">Om beliggenheten</h3>
                    <p className="text-xs leading-relaxed text-lokka-secondary md:text-sm">
                      Eiendommen ligger i et av Oslos mest dynamiske områder med utmerket tilgjengelighet
                      til kollektivtransport, serveringstilbud og kulturelle aktiviteter. Området preges av
                      høy aktivitet og god infrastruktur.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Main Content */}
      <Container className="py-8 md:py-16 lg:py-20">
        {/* Expandable Eiendomsprofil */}
        {eiendom.tilleggsinfo?.historikk && (
          <EiendomsprofilExpander
            historikk={eiendom.tilleggsinfo.historikk}
            adresse={eiendom.adresse}
          />
        )}

        {/* Analysis Content - Different rendering based on analyse type */}
        {analyse === '5min-gange' && currentAnalyse.screenshots.length > 0 && (
          <div className="mb-12 md:mb-20">
            <TabbedImageViewer
              screenshots={currentAnalyse.screenshots}
              title={`Plaace Stedsanalyse - ${currentAnalyse.tittel}`}
            />
          </div>
        )}

        {analyse === '1min-gange' && (
          <div className="mb-12 md:mb-20">
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <div className="mx-auto max-w-2xl">
                <div className="mb-4 text-6xl">📊</div>
                <h3 className="mb-2 text-2xl font-bold text-lokka-primary">
                  1 minutt gange analyse
                </h3>
                <p className="mb-6 text-lokka-secondary">
                  Denne analysen vil bruke CSV og JSON filer for aktiv data.
                  Implementeringen kommer snart.
                </p>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Merk:</strong> Struktur er klar for implementering av CSV/JSON-basert datavisning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* Aktør Liste */}
      {aktorData && (
        <AktorListe
          actors={aktorData.actors}
          categoryStats={aktorData.categoryStats}
          metadata={aktorData.metadata}
        />
      )}
    </>
  );
}
