# Datastruktur for Eiendommer

## Oversikt

Hver eiendom lagres som en JSON-fil i `/src/data/eiendommer/`.

## Filnavn-konvensjon

Format: `[eiendom-id].json`

Eksempel: `lokka-veien-1.json`

## Komplett struktur

Se `/src/data/eiendommer/template.json` for fullstendig eksempel.

## Obligatoriske felt

- `id` (string) - Unik identifikator
- `adresse` (string) - Gateadresse
- `gnr` (number) - Gårdsnummer
- `bnr` (number) - Bruksnummer
- `plaaceData.rapportDato` (ISO date string)
- `plaaceData.screenshots` (array, minimum 1)
- `metadata.opprettet` (ISO date string)
- `metadata.status` (enum)

## Screenshot-struktur

Hver screenshot må ha:
- `filnavn` - Filnavn (f.eks. "oversikt.png")
- `path` - Full path fra /public (f.eks. "/images/plaace/eiendom-1/oversikt.png")
- `beskrivelse` - Beskrivende tekst
- `kategori` - En av: oversikt, demografi, marked, utvikling, annet

## Validering

All data valideres ved lasting med Zod-schemas.

Kjør manuell validering:

```bash
npm run validate:data
```
