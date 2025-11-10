# Eiendomsdata

Denne mappen inneholder JSON-filer med data for hver eiendom.

## Struktur

Hver eiendom lagres som en separat JSON-fil med følgende navnekonvensjon:

```
[eiendom-id].json
```

Eksempel: `lokka-veien-1.json`

## Template

Bruk `template.json` som utgangspunkt når du legger til en ny eiendom.

## Validering

All data valideres automatisk med Zod-schemas ved lasting.

Kjør manuell validering:

```bash
npm run validate:data
```

## Legg til ny eiendom

Se `/docs/LEGG-TIL-EIENDOM.md` for detaljert guide.
