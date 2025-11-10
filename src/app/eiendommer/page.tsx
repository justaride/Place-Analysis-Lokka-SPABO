import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Eiendommer',
  description: 'Oversikt over eiendommer i Løkka-området',
};

export default function EiendommerPage() {
  return (
    <Container>
      <h1 className="mb-8 text-4xl font-bold text-lokka-primary">
        Eiendommer
      </h1>
      <p className="text-gray-600">
        Eiendomsoversikt kommer snart. Her vil du finne alle eiendommer med
        Plaace-analyser.
      </p>
    </Container>
  );
}
