import { notFound } from 'next/navigation';
import { lastEiendom, hentAlleEiendomsIder } from '@/lib/eiendom-loader';
import Container from '@/components/ui/Container';
import ImageViewer from '@/components/eiendom/ImageViewer';
import EiendomsprofilExpander from '@/components/eiendom/EiendomsprofilExpander';
import AktorListe from '@/components/eiendom/AktorListe';
import Link from 'next/link';
import Image from 'next/image';
import { formaterDato } from '@/lib/utils';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const ids = await hentAlleEiendomsIder();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const eiendom = await lastEiendom(id);

  if (!eiendom) {
    return {
      title: 'Eiendom ikke funnet',
    };
  }

  return {
    title: eiendom.adresse,
    description: eiendom.beskrivelse || `Placeanalyse for ${eiendom.adresse}`,
  };
}

export default async function EiendomPage({ params }: PageProps) {
  const { id } = await params;
  const eiendom = await lastEiendom(id);

  if (!eiendom) {
    notFound();
  }

  // Grupper PDFer etter kategori
  const pdfsByCategory = {
    oversikt: eiendom.plaaceData.screenshots.filter((s) => s.kategori === 'oversikt'),
    demografi: eiendom.plaaceData.screenshots.filter((s) => s.kategori === 'demografi'),
    marked: eiendom.plaaceData.screenshots.filter((s) => s.kategori === 'marked'),
    utvikling: eiendom.plaaceData.screenshots.filter((s) => s.kategori === 'utvikling'),
    annet: eiendom.plaaceData.screenshots.filter((s) => s.kategori === 'annet'),
  };

  // Load aktør data if available for this property
  let aktorData = null;
  try {
    const aktorPath = join(process.cwd(), 'src', 'data', 'aktorer', `${id}.json`);
    const aktorJson = await readFile(aktorPath, 'utf-8');
    aktorData = JSON.parse(aktorJson);
  } catch (error) {
    // Aktør data is optional - no error if file doesn't exist
  }

  return (
    <>
      {/* Header Section with Image */}
      <section className="border-b border-gray-200/30 bg-gradient-to-br from-lokka-primary to-lokka-secondary py-24 text-white">
        <Container>
          <div className="mb-8">
            <Link
              href="/eiendommer"
              className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <span>←</span> Tilbake til oversikt
            </Link>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {/* Text Content */}
            <div className="flex-1">
              <h1 className="mb-8 text-6xl font-bold tracking-tight">{eiendom.adresse}</h1>
              <div className="mb-8 flex flex-wrap gap-4 text-sm">
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur">
                  <span className="font-semibold">Gårdsnr:</span> {eiendom.gnr}
                </div>
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur">
                  <span className="font-semibold">Bruksnr:</span> {eiendom.bnr}
                </div>
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur">
                  <span className="font-semibold">Rapport:</span>{' '}
                  {formaterDato(eiendom.plaaceData.rapportDato)}
                </div>
              </div>
              {eiendom.beskrivelse && (
                <p className="max-w-3xl text-xl leading-relaxed text-white/90">
                  {eiendom.beskrivelse}
                </p>
              )}
            </div>

            {/* Property Image - Square */}
            {eiendom.heroImage && (
              <div className="flex-shrink-0">
                <div className="relative h-80 w-80 overflow-hidden rounded-2xl shadow-large">
                  <Image
                    src={eiendom.heroImage}
                    alt={eiendom.adresse}
                    fill
                    priority
                    className="object-cover"
                    quality={90}
                  />
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Location Section */}
      {(eiendom.mapImage || eiendom.coordinates) && (
        <section className="border-b border-gray-200/30 bg-white py-16">
          <Container>
            <h2 className="mb-8 text-3xl font-bold text-lokka-primary">Beliggenhet</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Area Map */}
              {eiendom.mapImage && (
                <div className="overflow-hidden rounded-2xl shadow-medium">
                  <Image
                    src={eiendom.mapImage}
                    alt={`Kart over ${eiendom.adresse} området`}
                    width={600}
                    height={600}
                    className="h-auto w-full"
                    quality={90}
                  />
                </div>
              )}

              {/* Google Maps */}
              {eiendom.coordinates && (
                <div className="overflow-hidden rounded-2xl shadow-medium">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${eiendom.coordinates.lat},${eiendom.coordinates.lng}&zoom=16`}
                    width="100%"
                    height="600"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Google Maps - ${eiendom.adresse}`}
                  />
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Main Content */}
      <Container className="py-20">
        {/* Expandable Eiendomsprofil for all properties with historikk */}
        {eiendom.tilleggsinfo?.historikk && (
          <EiendomsprofilExpander
            historikk={eiendom.tilleggsinfo.historikk}
            adresse={eiendom.adresse}
          />
        )}

        {/* Plaace Rapporter Section */}
        <section className="space-y-16">

          {/* Demografi */}
          {pdfsByCategory.demografi.length > 0 && (
            <div>
              {pdfsByCategory.demografi.map((image, index) => (
                <ImageViewer
                  key={index}
                  imagePath={image.path}
                  title={image.filnavn}
                  description={image.beskrivelse}
                  priority={index === 0}
                />
              ))}
            </div>
          )}

          {/* Marked */}
          {pdfsByCategory.marked.length > 0 && (
            <div className="space-y-16">
              {pdfsByCategory.marked.map((image, index) => (
                <ImageViewer
                  key={index}
                  imagePath={image.path}
                  title={image.filnavn}
                  description={image.beskrivelse}
                />
              ))}
            </div>
          )}

          {/* Utvikling */}
          {pdfsByCategory.utvikling.length > 0 && (
            <div className="space-y-16">
              {pdfsByCategory.utvikling.map((image, index) => (
                <ImageViewer
                  key={index}
                  imagePath={image.path}
                  title={image.filnavn}
                  description={image.beskrivelse}
                />
              ))}
            </div>
          )}

          {/* Annet */}
          {pdfsByCategory.annet.length > 0 && (
            <div className="space-y-16">
              {pdfsByCategory.annet.map((image, index) => (
                <ImageViewer
                  key={index}
                  imagePath={image.path}
                  title={image.filnavn}
                  description={image.beskrivelse}
                />
              ))}
            </div>
          )}
        </section>

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
