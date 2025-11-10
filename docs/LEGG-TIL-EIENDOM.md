# Guide: Legg til ny eiendom

## Trinnvis prosess

### 1. Forbered Plaace-screenshots

- Lagre alle screenshots fra Plaace-rapporten
- Navngi filene beskrivende (f.eks. `oversikt.png`, `demografi.png`)

### 2. Opprett eiendom-ID

Generer et unikt ID basert på adressen:

Eksempel: "Løkkaveien 1" → `lokka-veien-1`

### 3. Last opp bilder

Opprett mappe og last opp:

```bash
mkdir -p public/images/plaace/[eiendom-id]
# Kopier screenshots til denne mappen
```

### 4. Opprett JSON-fil

Kopier template:

```bash
cp src/data/eiendommer/template.json src/data/eiendommer/[eiendom-id].json
```

### 5. Fyll inn data

Rediger JSON-filen og fyll inn:
- Grunnleggende info (adresse, gnr, bnr)
- Oppdater screenshot-paths
- Legg inn nøkkeldata fra Plaace-rapporten
- Legg til beskrivelse og tilleggsinfo

### 6. Valider data

```bash
npm run validate:data
```

### 7. Test lokalt

```bash
npm run dev
```

Naviger til: http://localhost:3000/eiendommer/[eiendom-id]

### 8. Commit og push

```bash
git add .
git commit -m "Legg til eiendom: [adresse]"
git push
```

## Sjekkliste

- [ ] Screenshots lastet opp til korrekt mappe
- [ ] JSON-fil opprettet med unikt ID
- [ ] All obligatorisk data fylt inn
- [ ] Screenshots-paths matcher faktiske filer
- [ ] Validering bestått
- [ ] Testet lokalt
- [ ] Committed til git
