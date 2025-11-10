import { notFound } from 'next/navigation';
import { lastEiendom, hentAlleEiendomsIder } from '@/lib/eiendom-loader';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import PdfViewer from '@/components/eiendom/PdfViewer';
import Link from 'next/link';
import { formaterDato } from '@/lib/utils';

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

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-gray-200 bg-gradient-to-br from-lokka-primary to-lokka-secondary py-16 text-white">
        <Container>
          <div className="mb-6">
            <Link
              href="/eiendommer"
              className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <span>←</span> Tilbake til oversikt
            </Link>
          </div>
          <h1 className="mb-6 text-5xl font-bold">{eiendom.adresse}</h1>
          <div className="mb-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-lg bg-white/15 px-5 py-2.5 backdrop-blur">
              <span className="font-semibold">Gårdsnr:</span> {eiendom.gnr}
            </div>
            <div className="rounded-lg bg-white/15 px-5 py-2.5 backdrop-blur">
              <span className="font-semibold">Bruksnr:</span> {eiendom.bnr}
            </div>
            <div className="rounded-lg bg-white/15 px-5 py-2.5 backdrop-blur">
              <span className="font-semibold">Rapport:</span>{' '}
              {formaterDato(eiendom.plaaceData.rapportDato)}
            </div>
          </div>
          {eiendom.beskrivelse && (
            <p className="max-w-4xl text-xl leading-relaxed text-white/95">
              {eiendom.beskrivelse}
            </p>
          )}
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-12">
        {/* Tilleggsinfo Section - Moved to top */}
        {(eiendom.tilleggsinfo.historikk ||
          eiendom.tilleggsinfo.kontaktperson ||
          (eiendom.tilleggsinfo.notater && eiendom.tilleggsinfo.notater.length > 0)) && (
          <section className="mb-12">
            <Card>
              <CardContent className="prose prose-lg max-w-none p-8">
                {eiendom.tilleggsinfo.historikk && (
                  <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{
                      __html: eiendom.tilleggsinfo.historikk.replace(/\n/g, '<br/>'),
                    }}
                  />
                )}
                {eiendom.tilleggsinfo.kontaktperson && (
                  <div className="mt-6 rounded-lg bg-lokka-light p-4">
                    <p className="text-sm font-semibold text-lokka-primary">
                      📞 Kontaktinformasjon
                    </p>
                    <p className="mt-1 text-gray-700">
                      {eiendom.tilleggsinfo.kontaktperson}
                    </p>
                  </div>
                )}
                {eiendom.tilleggsinfo.notater &&
                  eiendom.tilleggsinfo.notater.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-3 font-semibold text-lokka-primary">
                        📋 Viktig informasjon
                      </h4>
                      <ul className="grid gap-2 md:grid-cols-2">
                        {eiendom.tilleggsinfo.notater.map((notat, index) => (
                          <li
                            key={index}
                            className="rounded-lg bg-lokka-light p-3 text-sm text-gray-700"
                          >
                            {notat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Nøkkeldata Section */}
        {eiendom.plaaceData.nokkeldata && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
              Nøkkeldata
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eiendom.plaaceData.nokkeldata.prisniva && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Prisnivå</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-lokka-primary">
                      {eiendom.plaaceData.nokkeldata.prisniva}
                    </p>
                  </CardContent>
                </Card>
              )}
              {eiendom.plaaceData.nokkeldata.leieinntekter && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Leieinntekter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-lokka-primary">
                      {eiendom.plaaceData.nokkeldata.leieinntekter}
                    </p>
                  </CardContent>
                </Card>
              )}
              {eiendom.plaaceData.nokkeldata.befolkning && eiendom.plaaceData.nokkeldata.befolkning > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Befolkning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-lokka-primary">
                      {eiendom.plaaceData.nokkeldata.befolkning.toLocaleString('nb-NO')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Plaace Rapporter Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
            Plaace Rapporter
          </h2>

          {/* Oversikt */}
          {pdfsByCategory.oversikt.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">
                Oversikt
              </h3>
              <div className="space-y-4">
                {pdfsByCategory.oversikt.map((pdf, index) => (
                  <PdfViewer
                    key={index}
                    pdfUrl={pdf.path}
                    title={pdf.filnavn}
                    description={pdf.beskrivelse}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Demografi */}
          {pdfsByCategory.demografi.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">
                Demografi
              </h3>
              <div className="space-y-4">
                {pdfsByCategory.demografi.map((pdf, index) => (
                  <PdfViewer
                    key={index}
                    pdfUrl={pdf.path}
                    title={pdf.filnavn}
                    description={pdf.beskrivelse}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Marked */}
          {pdfsByCategory.marked.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">
                Markedsanalyse
              </h3>
              <div className="space-y-4">
                {pdfsByCategory.marked.map((pdf, index) => (
                  <PdfViewer
                    key={index}
                    pdfUrl={pdf.path}
                    title={pdf.filnavn}
                    description={pdf.beskrivelse}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Utvikling */}
          {pdfsByCategory.utvikling.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">
                Utvikling
              </h3>
              <div className="space-y-4">
                {pdfsByCategory.utvikling.map((pdf, index) => (
                  <PdfViewer
                    key={index}
                    pdfUrl={pdf.path}
                    title={pdf.filnavn}
                    description={pdf.beskrivelse}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Annet */}
          {pdfsByCategory.annet.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">
                Øvrig informasjon
              </h3>
              <div className="space-y-4">
                {pdfsByCategory.annet.map((pdf, index) => (
                  <PdfViewer
                    key={index}
                    pdfUrl={pdf.path}
                    title={pdf.filnavn}
                    description={pdf.beskrivelse}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

      </Container>
    </>
  );
}
