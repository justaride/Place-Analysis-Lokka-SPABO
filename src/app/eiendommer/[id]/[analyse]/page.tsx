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

// Analytics components for 1min-gange
import AldersfordelingPyramid from '@/components/analytics/AldersfordelingPyramid';
import InntektsfordelingChart from '@/components/analytics/InntektsfordelingChart';
import KorthandelTidsserie from '@/components/analytics/KorthandelTidsserie';
import BesoksmønsterUkedag from '@/components/analytics/BesoksmønsterUkedag';
import KonseptmiksChart from '@/components/analytics/KonseptmiksChart';
import BesokPerTimeChart from '@/components/analytics/BesokPerTimeChart';
import KjederVsUavhengigeChart from '@/components/analytics/KjederVsUavhengigeChart';
import KorthandelPerUkedagChart from '@/components/analytics/KorthandelPerUkedagChart';
import MedianinntektChart from '@/components/analytics/MedianinntektChart';
import OpprinnelseChart from '@/components/analytics/OpprinnelseChart';
import LandChart from '@/components/analytics/LandChart';
import ExecutiveSummary from '@/components/analytics/ExecutiveSummary';
import QuickInsight from '@/components/analytics/QuickInsight';
import HusholdningerChart from '@/components/analytics/HusholdningerChart';
import TabbedSection from '@/components/ui/TabbedSection';
import { Users, DollarSign, Home, Clock, BarChart3, Map, Globe } from 'lucide-react';

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
  // For 1min-gange, use separate aktør file
  let aktorData = null;
  let totalRevenue = 0;
  let topCategory = '';
  try {
    const aktorFilename = analyse === '1min-gange' ? `${id}-1min.json` : `${id}.json`;
    const aktorPath = join(process.cwd(), 'src', 'data', 'aktorer', aktorFilename);
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

  // Load specific analysis data for 1min-gange
  let analyseSpecificData = null;
  if (analyse === '1min-gange') {
    try {
      // Load demografi data
      const demografiPath = join(process.cwd(), 'src', 'data', 'demografi', `${id}-1min.json`);
      const demografiJson = await readFile(demografiPath, 'utf-8');
      const demografiData = JSON.parse(demografiJson);

      // Load korthandel data
      const korthandelPath = join(process.cwd(), 'src', 'data', 'marked', `${id}-1min-korthandel.json`);
      const korthandelJson = await readFile(korthandelPath, 'utf-8');
      const korthandelData = JSON.parse(korthandelJson);

      // Load bevegelse data
      const bevegelsePath = join(process.cwd(), 'src', 'data', 'bevegelse', `${id}-1min.json`);
      const bevegelseJson = await readFile(bevegelsePath, 'utf-8');
      const bevegelseData = JSON.parse(bevegelseJson);

      // Load konkurransebilde data
      const konkurransePath = join(process.cwd(), 'src', 'data', 'konkurransebilde', `${id}-1min.json`);
      const konkurranseJson = await readFile(konkurransePath, 'utf-8');
      const konkurranseData = JSON.parse(konkurranseJson);

      analyseSpecificData = {
        demografi: demografiData,
        korthandel: korthandelData,
        bevegelse: bevegelseData,
        konkurransebilde: konkurranseData
      };
    } catch (error) {
      console.log('Analysis-specific data not found:', error);
    }
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

      {/* 1min-gange Specific Sections */}
      {analyse === '1min-gange' && analyseSpecificData && (
        <>
          {/* Executive Summary */}
          <section className="border-t border-gray-200/30 bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
            <Container>
              <ExecutiveSummary
                data={{
                  befolkning: analyseSpecificData.demografi?.nøkkeltall?.befolkning || 0,
                  dagligOmsetning: analyseSpecificData.korthandel?.nøkkeltall?.dagligOmsetning?.toString() || '0',
                  dagligBesøk: analyseSpecificData.bevegelse?.nøkkeltall?.dagligBesøk || 0,
                  konseptTetthet: analyseSpecificData.konkurransebilde?.nøkkeltall?.konseptTetthet || 0,
                  internasjonaleProsent: analyseSpecificData.bevegelse?.opprinnelseLand ?
                    analyseSpecificData.bevegelse.opprinnelseLand.reduce((sum: number, land: any) => sum + land.prosent, 0) : undefined,
                  trendKorthandel: analyseSpecificData.korthandel?.nøkkeltall?.trend || 0,
                  trendKonsepter: analyseSpecificData.konkurransebilde?.nøkkeltall?.trend?.konseptTetthet || 0
                }}
              />
            </Container>
          </section>

          {/* Demografi Section */}
          {analyseSpecificData.demografi && (
            <section className="border-t border-gray-200/30 bg-white py-12 md:py-16">
              <Container>
                <FadeIn>
                  <h2 className="mb-6 text-2xl font-bold text-lokka-primary md:mb-8 md:text-3xl">
                    📊 Demografi
                  </h2>
                  <p className="mb-6 text-sm text-lokka-secondary md:mb-8 md:text-base">
                    Befolkningssammensetning innen 1 minutts gange ({analyseSpecificData.demografi.nøkkeltall.befolkning} innbyggere)
                  </p>
                </FadeIn>

                {/* Quick Insight */}
                <div className="mb-8">
                  <QuickInsight type="insight">
                    Området har en <strong>befolkningstetthet på 25,500 per km²</strong> med en jevn
                    aldersfordeling. Høyeste inntektsgruppe dominerer med sterk kjøpekraft.
                  </QuickInsight>
                </div>

                {/* Tabbed Demographics */}
                <TabbedSection
                  defaultTab="alder"
                  tabs={[
                    {
                      id: 'alder',
                      label: 'Aldersfordeling',
                      icon: <Users className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <AldersfordelingPyramid data={analyseSpecificData.demografi.aldersfordeling} />
                        </div>
                      )
                    },
                    {
                      id: 'inntekt',
                      label: 'Inntektsfordeling',
                      icon: <DollarSign className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <InntektsfordelingChart data={analyseSpecificData.demografi.inntektsfordeling} />
                        </div>
                      )
                    },
                    ...(analyseSpecificData.demografi.medianInntektPerHusholdstype ? [{
                      id: 'medianinntekt',
                      label: 'Medianinntekt',
                      icon: <BarChart3 className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <MedianinntektChart data={analyseSpecificData.demografi.medianInntektPerHusholdstype} />
                        </div>
                      )
                    }] : []),
                    ...(analyseSpecificData.demografi.husholdninger ? [{
                      id: 'husholdninger',
                      label: 'Husholdningstyper',
                      icon: <Home className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <HusholdningerChart data={analyseSpecificData.demografi.husholdninger} />
                        </div>
                      )
                    }] : [])
                  ]}
                />
              </Container>
            </section>
          )}

          {/* Bevegelse Section */}
          {analyseSpecificData.bevegelse && (
            <section className="border-t border-gray-200/30 bg-gray-50 py-12 md:py-16">
              <Container>
                <FadeIn>
                  <h2 className="mb-6 text-2xl font-bold text-lokka-primary md:mb-8 md:text-3xl">
                    🚶 Besøksmønster
                  </h2>
                  <p className="mb-6 text-sm text-lokka-secondary md:mb-8 md:text-base">
                    Daglig gjennomsnitt: {analyseSpecificData.bevegelse.nøkkeltall.dagligBesøk.toLocaleString()} besøk/dag
                  </p>
                </FadeIn>

                {/* Quick Insight */}
                <div className="mb-8">
                  <QuickInsight type="insight">
                    <strong>{analyseSpecificData.bevegelse.nøkkeltall.travlesteDag}</strong> er travleste dag med
                    <strong> {analyseSpecificData.bevegelse.nøkkeltall.lørdagAndel}% av ukens besøk</strong>. Området har
                    <strong> {analyseSpecificData.bevegelse.nøkkeltall.besøkPerKm2.toLocaleString()} besøk/km²</strong> daglig.
                  </QuickInsight>
                </div>

                {/* Tabbed Bevegelse */}
                <TabbedSection
                  defaultTab="ukedag"
                  tabs={[
                    {
                      id: 'ukedag',
                      label: 'Per ukedag',
                      icon: <BarChart3 className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <BesoksmønsterUkedag data={analyseSpecificData.bevegelse.perUkedag} />
                        </div>
                      )
                    },
                    ...(analyseSpecificData.bevegelse.perTime ? [{
                      id: 'time',
                      label: 'Per time',
                      icon: <Clock className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <BesokPerTimeChart data={analyseSpecificData.bevegelse.perTime} />
                        </div>
                      )
                    }] : []),
                    {
                      id: 'stats',
                      label: 'Nøkkeltall',
                      icon: <BarChart3 className="h-4 w-4" />,
                      content: (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-xl border border-gray-200/50 bg-lokka-light/30 p-4 md:p-6">
                            <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                              Besøk per km²
                            </p>
                            <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                              {analyseSpecificData.bevegelse.nøkkeltall.besøkPerKm2.toLocaleString()}
                            </p>
                            <p className="mt-1 text-xs text-lokka-accent md:text-sm">per dag</p>
                          </div>
                          <div className="rounded-xl border border-gray-200/50 bg-lokka-light/30 p-4 md:p-6">
                            <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                              Travleste dag
                            </p>
                            <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                              {analyseSpecificData.bevegelse.nøkkeltall.travlesteDag}
                            </p>
                            <p className="mt-1 text-xs text-lokka-accent md:text-sm">
                              {analyseSpecificData.bevegelse.nøkkeltall.lørdagAndel}% av ukesbesøk
                            </p>
                          </div>
                        </div>
                      )
                    }
                  ]}
                />
              </Container>
            </section>
          )}

          {/* Visitor Origin Section */}
          {analyseSpecificData.bevegelse && (analyseSpecificData.bevegelse.opprinnelseOmråder || analyseSpecificData.bevegelse.opprinnelseLand) && (
            <section className="border-t border-gray-200/30 bg-white py-12 md:py-16">
              <Container>
                <FadeIn>
                  <h2 className="mb-6 text-2xl font-bold text-lokka-primary md:mb-8 md:text-3xl">
                    🌍 Besøkende - Opprinnelse
                  </h2>
                  <p className="mb-6 text-sm text-lokka-secondary md:mb-8 md:text-base">
                    Geografisk og internasjonal fordeling av besøkende til området
                  </p>
                </FadeIn>

                {/* Quick Insight */}
                <div className="mb-8">
                  <QuickInsight type="info">
                    <strong>Grünerløkka</strong> er det dominerende kildeområdet. Internasjonale besøkende utgjør en
                    betydelig andel, med <strong>Danmark, Sverige og Tyskland</strong> som toppland.
                  </QuickInsight>
                </div>

                {/* Tabbed Visitor Origin */}
                <TabbedSection
                  defaultTab="områder"
                  tabs={[
                    ...(analyseSpecificData.bevegelse.opprinnelseOmråder ? [{
                      id: 'områder',
                      label: 'Geografiske områder',
                      icon: <Map className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <OpprinnelseChart data={analyseSpecificData.bevegelse.opprinnelseOmråder} limit={15} />
                        </div>
                      )
                    }] : []),
                    ...(analyseSpecificData.bevegelse.opprinnelseLand ? [{
                      id: 'land',
                      label: 'Internasjonale besøkende',
                      icon: <Globe className="h-4 w-4" />,
                      content: (
                        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                          <LandChart data={analyseSpecificData.bevegelse.opprinnelseLand} limit={20} />
                        </div>
                      )
                    }] : [])
                  ]}
                />
              </Container>
            </section>
          )}

          {/* Korthandel Section */}
          {analyseSpecificData.korthandel && (
            <section className="border-t border-gray-200/30 bg-gray-50 py-12 md:py-16">
              <Container>
                <FadeIn>
                  <h2 className="mb-6 text-2xl font-bold text-lokka-primary md:mb-8 md:text-3xl">
                    💳 Korthandel 2019-2025
                  </h2>
                  <p className="mb-6 text-sm text-lokka-secondary md:mb-8 md:text-base">
                    Utvikling i korthandel over tid. Daglig omsetning: NOK {analyseSpecificData.korthandel.nøkkeltall.dagligOmsetning}M
                  </p>
                </FadeIn>

                {/* Quick Insight */}
                <div className="mb-8">
                  <QuickInsight type={analyseSpecificData.korthandel.nøkkeltall.trend < 0 ? "warning" : "trend"}>
                    Korthandel viser <strong>{analyseSpecificData.korthandel.nøkkeltall.trend > 0 ? '+' : ''}{analyseSpecificData.korthandel.nøkkeltall.trend}% trend</strong> siste 30 dager.
                    Total omsetning på <strong>NOK {analyseSpecificData.korthandel.nøkkeltall.totalOmsetning}M</strong> fra 2019-2025.
                  </QuickInsight>
                </div>

                <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                  <KorthandelTidsserie data={analyseSpecificData.korthandel.tidsserie} />
                </div>

                {/* Key Stats */}
                <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-3">
                  <div className="rounded-xl border border-gray-200/50 bg-white p-4 text-center md:p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                      Total omsetning
                    </p>
                    <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                      NOK {analyseSpecificData.korthandel.nøkkeltall.totalOmsetning}M
                    </p>
                    <p className="mt-1 text-xs text-lokka-accent md:text-sm">2019-2025</p>
                  </div>
                  <div className="rounded-xl border border-gray-200/50 bg-white p-4 text-center md:p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                      Gj.snitt transaksjon
                    </p>
                    <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                      NOK {analyseSpecificData.korthandel.nøkkeltall.gjennomsnittTransaksjon}
                    </p>
                    <p className="mt-1 text-xs text-lokka-accent md:text-sm">per kjøp</p>
                  </div>
                  <div className="rounded-xl border border-gray-200/50 bg-white p-4 text-center md:p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                      Trend (30 dager)
                    </p>
                    <p className={`mt-2 text-2xl font-bold md:text-3xl ${analyseSpecificData.korthandel.nøkkeltall.trend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {analyseSpecificData.korthandel.nøkkeltall.trend > 0 ? '+' : ''}{analyseSpecificData.korthandel.nøkkeltall.trend}%
                    </p>
                    <p className="mt-1 text-xs text-lokka-accent md:text-sm">siste måned</p>
                  </div>
                </div>

                {/* Korthandel per ukedag - årlig trend */}
                {analyseSpecificData.korthandel.perUkedag && (
                  <div className="mt-8 md:mt-12">
                    <h3 className="mb-4 text-lg font-semibold text-lokka-primary md:text-xl">
                      Utvikling per ukedag
                    </h3>
                    <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                      <KorthandelPerUkedagChart data={analyseSpecificData.korthandel.perUkedag} />
                    </div>
                  </div>
                )}
              </Container>
            </section>
          )}

          {/* Konkurransebilde Section */}
          {analyseSpecificData.konkurransebilde && (
            <section className="border-t border-gray-200/30 bg-gray-50 py-12 md:py-16">
              <Container>
                <FadeIn>
                  <h2 className="mb-6 text-2xl font-bold text-lokka-primary md:mb-8 md:text-3xl">
                    🏪 Konkurransebilde
                  </h2>
                  <p className="mb-6 text-sm text-lokka-secondary md:mb-8 md:text-base">
                    Markedsanalyse og konseptsammensetning i området
                  </p>
                </FadeIn>

                {/* Quick Insight */}
                <div className="mb-8">
                  <QuickInsight type="trend">
                    Området viser <strong>{analyseSpecificData.konkurransebilde.nøkkeltall.trend.konseptTetthet}% nedgang</strong> i konsepttetthet,
                    men opprettholder ekstremt høy omsetning på <strong>NOK 7.6 mrd/km²</strong>.
                    Uavhengige konsepter øker sin markedsandel over tid.
                  </QuickInsight>
                </div>

                {/* Key Market Stats */}
                <div className="mb-8 grid gap-4 md:mb-12 md:grid-cols-4">
                  <div className="rounded-xl border border-gray-200/50 bg-lokka-light/30 p-4 text-center md:p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                      Konsepttetthet
                    </p>
                    <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                      {analyseSpecificData.konkurransebilde.nøkkeltall.konseptTetthet}
                    </p>
                    <p className="mt-1 text-xs text-lokka-accent md:text-sm">per km²</p>
                    <p className={`mt-1 text-sm font-semibold ${analyseSpecificData.konkurransebilde.nøkkeltall.trend.konseptTetthet < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {analyseSpecificData.konkurransebilde.nøkkeltall.trend.konseptTetthet > 0 ? '+' : ''}{analyseSpecificData.konkurransebilde.nøkkeltall.trend.konseptTetthet}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200/50 bg-lokka-light/30 p-4 text-center md:p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                      Total omsetning
                    </p>
                    <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                      NOK {analyseSpecificData.konkurransebilde.nøkkeltall.totalOmsetning}M
                    </p>
                    <p className="mt-1 text-xs text-lokka-accent md:text-sm">i området</p>
                    <p className={`mt-1 text-sm font-semibold ${analyseSpecificData.konkurransebilde.nøkkeltall.trend.omsetning < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {analyseSpecificData.konkurransebilde.nøkkeltall.trend.omsetning > 0 ? '+' : ''}{analyseSpecificData.konkurransebilde.nøkkeltall.trend.omsetning}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200/50 bg-lokka-light/30 p-4 text-center md:p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                      Omsetningtetthet
                    </p>
                    <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                      NOK {(analyseSpecificData.konkurransebilde.nøkkeltall.omsetningTetthet / 1000).toFixed(1)}B
                    </p>
                    <p className="mt-1 text-xs text-lokka-accent md:text-sm">per km²</p>
                  </div>
                  <div className="rounded-xl border border-gray-200/50 bg-lokka-light/30 p-4 text-center md:p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-lokka-secondary">
                      Konsepter
                    </p>
                    <p className="mt-2 text-2xl font-bold text-lokka-primary md:text-3xl">
                      {analyseSpecificData.konkurransebilde.konseptmiks.reduce((sum: number, k: any) => sum + k.antall, 0)}
                    </p>
                    <p className="mt-1 text-xs text-lokka-accent md:text-sm">totalt</p>
                  </div>
                </div>

                {/* Konseptmiks */}
                {analyseSpecificData.konkurransebilde.konseptmiks && (
                  <div className="mb-8 md:mb-12">
                    <h3 className="mb-4 text-lg font-semibold text-lokka-primary md:text-xl">
                      Konseptmiks
                    </h3>
                    <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                      <KonseptmiksChart data={analyseSpecificData.konkurransebilde.konseptmiks} />
                    </div>
                  </div>
                )}

                {/* Kjeder vs Uavhengige */}
                {analyseSpecificData.konkurransebilde.kjederVsUavhengige && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-lokka-primary md:text-xl">
                      Kjeder vs. Uavhengige konsepter
                    </h3>
                    <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-medium md:p-6">
                      <KjederVsUavhengigeChart data={analyseSpecificData.konkurransebilde.kjederVsUavhengige} />
                    </div>
                  </div>
                )}
              </Container>
            </section>
          )}
        </>
      )}
    </>
  );
}
