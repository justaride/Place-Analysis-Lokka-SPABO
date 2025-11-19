# Autentiserings-guide for Place Analysis Løkka

## 🔐 Slik slår du passord-beskyttelse AV/PÅ

### Lokalt (Development)

Rediger `.env.local`:

```bash
# For å DEAKTIVERE passord-beskyttelse (offentlig tilgjengelig)
ENABLE_AUTH=false

# For å AKTIVERE passord-beskyttelse
ENABLE_AUTH=true
SITE_PASSWORD=Thorvald
```

### På Vercel (Production)

Bruk Vercel CLI eller dashboard:

**Metode 1: Via Vercel CLI**
```bash
# Deaktiver passord-beskyttelse
vercel env add ENABLE_AUTH
# Skriv inn: false
# Velg: Production, Preview, Development

# Aktiver passord-beskyttelse
vercel env add ENABLE_AUTH
# Skriv inn: true
# Velg: Production, Preview, Development

# Deploy på nytt for at endringene skal tre i kraft
vercel --prod
```

**Metode 2: Via Vercel Dashboard**
1. Gå til https://vercel.com/justarides-projects/place-analysis-lokka/settings/environment-variables
2. Legg til eller rediger `ENABLE_AUTH` environment variable
3. Sett verdi til `true` eller `false`
4. Velg miljøer: Production, Preview, Development
5. Deploy på nytt

## 📋 Environment Variables Oversikt

| Variabel | Verdi | Beskrivelse |
|----------|-------|-------------|
| `ENABLE_AUTH` | `true` eller `false` | Slår passord-beskyttelse av/på |
| `SITE_PASSWORD` | `Thorvald` | Passordet for innlogging (kun brukt når ENABLE_AUTH=true) |

## 🔧 Feilsøking

### Problem: Login-siden henger på "Laster..."
**Løsning:** Dette er nå fikset i koden. Hvis du fortsatt opplever problemet:
1. Sjekk at du har nyeste versjon av koden
2. Clear browser cache
3. Deploy på nytt til Vercel

### Problem: Passordet virker ikke
**Sjekk:**
1. At `ENABLE_AUTH=true` er satt i Vercel environment variables
2. At `SITE_PASSWORD` er korrekt satt i Vercel
3. At cookies ikke er blokkert i nettleseren
4. At du har deployet etter å ha endret environment variables

### Problem: Siden er fortsatt beskyttet selv om ENABLE_AUTH=false
**Løsning:**
1. Sjekk at environment variable er oppdatert i riktig miljø (Production/Preview/Development)
2. Deploy på nytt til Vercel
3. Clear browser cache og cookies

## 🚀 Quick Commands

```bash
# Test lokalt uten passord
cd /Users/gabrielboen/place-analysis-lokka
ENABLE_AUTH=false npm run dev

# Test lokalt med passord
ENABLE_AUTH=true SITE_PASSWORD=Thorvald npm run dev

# Deploy til Vercel
vercel --prod

# Se environment variables på Vercel
vercel env ls
```

## 📝 Notater

- **Fikset:** Login-siden bruker nå `useEffect` for `useSearchParams` for å unngå hydration-issues
- **Anbefaling:** Sett `ENABLE_AUTH=false` på Vercel for å gjøre siden offentlig tilgjengelig
- **Sikkerhet:** Hvis du bruker passord-beskyttelse, vurder å endre passordet regelmessig
