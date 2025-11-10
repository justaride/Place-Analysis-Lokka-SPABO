# Place Analysis Løkka

Nettside for visning av placeanalyser og eiendomsinformasjon for Løkka Gårdeierforening.

## Teknologi

- **Next.js 16** - React framework med App Router
- **TypeScript** - Type-safe utvikling
- **Tailwind CSS** - Utility-first CSS
- **Zod** - Runtime validering

## Komme i gang

### Installasjon

```bash
npm install
```

### Utvikling

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000)

### Bygg

```bash
npm run build
npm start
```

## Legg til ny eiendom

Se [docs/LEGG-TIL-EIENDOM.md](docs/LEGG-TIL-EIENDOM.md)

## Prosjektstruktur

- `/src/app` - Next.js routes og sider
- `/src/components` - React-komponenter
- `/src/lib` - Utilities og helper-funksjoner
- `/src/types` - TypeScript type definitions
- `/src/data/eiendommer` - Eiendomsdata (JSON)
- `/public/images/plaace` - Plaace-screenshots
- `/docs` - Dokumentasjon

## Scripts

- `npm run dev` - Start utviklingsserver
- `npm run build` - Bygg produksjonsversjon
- `npm run start` - Start produksjonsserver
- `npm run lint` - Kjør ESLint
- `npm run lint:fix` - Fiks ESLint-feil automatisk
- `npm run format` - Formater kode med Prettier
- `npm run format:check` - Sjekk kodeformatering
- `npm run type-check` - Kjør TypeScript type checking
- `npm run validate:data` - Valider eiendomsdata

## Deployment

Prosjektet er optimalisert for deployment på Vercel.

```bash
vercel
```

Se [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for mer info.

## Dokumentasjon

- [Datastruktur](docs/DATASTRUKTUR.md)
- [Legg til eiendom](docs/LEGG-TIL-EIENDOM.md)
- [Deployment](docs/DEPLOYMENT.md)

## Lisens

Privat prosjekt for Løkka Gårdeierforening.
