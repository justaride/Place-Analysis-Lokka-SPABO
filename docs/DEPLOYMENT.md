# Deployment Guide

## Vercel (Anbefalt)

Prosjektet er optimalisert for deployment på Vercel.

### Første gang

1. Installer Vercel CLI:
```bash
npm install -g vercel
```

2. Login til Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Deploy til produksjon:
```bash
vercel --prod
```

### Automatisk deployment

Koble GitHub repository til Vercel for automatisk deployment ved push til main branch.

1. Gå til [vercel.com](https://vercel.com)
2. "Add New Project"
3. Importer GitHub repository
4. Vercel vil automatisk detektere Next.js og sette opp byggekommandoer

## Miljøvariabler

Hvis prosjektet trenger miljøvariabler, sett de opp i Vercel dashboard under "Settings" → "Environment Variables".

## Custom Domain

Sett opp custom domain i Vercel dashboard under "Settings" → "Domains".

## Build Commands

- Build: `npm run build`
- Start: `npm start`
- Dev: `npm run dev`
