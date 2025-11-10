import Container from '@/components/ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'Om Prosjektet',
  description: 'Informasjon om Place Analysis Løkka prosjektet',
};

export default function OmProsjektetPage() {
  return (
    <Container>
      <h1 className="mb-8 text-4xl font-bold text-lokka-primary">
        Om Prosjektet
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Formål</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Place Analysis Løkka er en nettside for Løkka Gårdeierforening som
              samler og presenterer omfattende placeanalyser for eiendommer i
              området. Målet er å gi medlemmene tilgang til verdifull
              eiendomsinformasjon, demografi og markedsdata.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teknologi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Nettsiden er bygget med moderne webutviklingsteknologi: Next.js 15,
              TypeScript, og Tailwind CSS. Dette sikrer en rask, sikker og
              vedlikeholdbar løsning.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datakilder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              All data kommer fra Plaace-rapporter som inneholder detaljert
              informasjon om demografi, markedsforhold, prisnivå, og
              utviklingstrender for hvert område.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontakt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              For spørsmål om prosjektet, kontakt Løkka Gårdeierforening.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
