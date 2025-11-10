import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Eiendom } from '@/types/eiendom';
import { formaterDato } from '@/lib/utils';

interface EiendomCardProps {
  eiendom: Eiendom;
}

export default function EiendomCard({ eiendom }: EiendomCardProps) {
  const antallRapporter = eiendom.plaaceData.screenshots.length;

  return (
    <Link href={`/eiendommer/${eiendom.id}`}>
      <Card hover className="h-full transition-all">
        <CardHeader>
          <CardTitle>{eiendom.adresse}</CardTitle>
          <div className="mt-2 flex gap-2 text-xs text-gray-600">
            <span className="rounded-full bg-lokka-primary/10 px-2 py-1">
              Gnr: {eiendom.gnr}
            </span>
            <span className="rounded-full bg-lokka-primary/10 px-2 py-1">
              Bnr: {eiendom.bnr}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {eiendom.beskrivelse && (
            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {eiendom.beskrivelse}
            </p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rapporter:</span>
              <span className="font-semibold text-lokka-primary">
                {antallRapporter} PDF{antallRapporter !== 1 ? 'er' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Oppdatert:</span>
              <span className="font-semibold text-lokka-primary">
                {formaterDato(eiendom.plaaceData.rapportDato)}
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm font-medium text-lokka-primary">
            Se detaljer →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
