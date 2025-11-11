# Aktør CSV Prosessering - Instruksjonsguide

## Oversikt
Denne guiden viser hvordan du prosesserer aktør-CSV filer for å legge dem til på eiendomssider.

## Forutsetninger
- CSV-fil fra Plaace med aktørdata
- Python 3 installert
- Eiendom allerede opprettet i systemet

## Steg-for-Steg Prosess

### 1. Verifiser CSV-struktur

CSV-filen må ha følgende kolonner:
```
#, Navn, Type, Adresse, Kommune, Omsetning, YoY-vekst, Ansatte, Markedsandel
```

**Eksempel på data:**
```csv
#,Navn,Type,Adresse,Kommune,Omsetning,YoY-vekst,Ansatte,Markedsandel
#1,Kiwi Minipris Fredensborg,Handel / Mat og drikke,MØLLERGATA 56,Oslo,"NOK 77 mill.

0.1% av kjede","-6%

(%)","22

14292 i 725 lokasjoner","5.46%

i området"
```

**Viktig:** Data har newlines (`\n\n`) i cellene - scriptet håndterer dette automatisk.

---

### 2. Prosesser CSV til JSON

**Script:** `/Users/gabrielboen/place-analysis-lokka/scripts/process_aktor_csv.py`

```python
#!/usr/bin/env python3
"""
Prosesserer aktør-CSV til JSON-format for Place Analysis Løkka
"""

import pandas as pd
import json
import re
import sys
from pathlib import Path

def parse_omsetning(text):
    """Ekstraher omsetning og kjede-prosent fra tekst"""
    if pd.isna(text):
        return None, None

    text = str(text)
    revenue_match = re.search(r'NOK\s+(\d+)\s+mill', text)
    revenue = int(revenue_match.group(1)) if revenue_match else None

    chain_match = re.search(r'(\d+\.?\d*%)\s+av kjede', text)
    chain_pct = chain_match.group(1) if chain_match else None

    return revenue, chain_pct

def parse_ansatte(text):
    """Ekstraher lokale ansatte og kjede-info fra tekst"""
    if pd.isna(text):
        return None, None, None

    text = str(text)
    local_match = re.search(r'^(\d+)', text)
    local_employees = int(local_match.group(1)) if local_match else None

    chain_match = re.search(r'(\d+)\s+i\s+(\d+)\s+lokasjoner', text)
    if chain_match:
        chain_total = int(chain_match.group(1))
        chain_locations = int(chain_match.group(2))
    else:
        chain_total = None
        chain_locations = None

    return local_employees, chain_total, chain_locations

def extract_yoy(text):
    """Ekstraher YoY-vekst prosent"""
    if pd.isna(text):
        return None
    match = re.search(r'(-?\d+\.?\d*)%', str(text))
    return float(match.group(1)) if match else None

def extract_market_share(text):
    """Ekstraher markedsandel prosent"""
    if pd.isna(text):
        return None
    match = re.search(r'(\d+\.?\d*)%', str(text))
    return float(match.group(1)) if match else None

def process_csv(csv_path, output_path):
    """Hovedfunksjon: Prosesser CSV til JSON"""

    # Les CSV
    df = pd.read_csv(csv_path)

    # Prosesser hver rad
    actors = []
    for _, row in df.iterrows():
        revenue, chain_pct = parse_omsetning(row['Omsetning'])
        local_emp, chain_emp_total, chain_locations = parse_ansatte(row['Ansatte'])

        actor = {
            "rank": str(row['#']).strip(),
            "navn": str(row['Navn']).strip(),
            "type": str(row['Type']).strip(),
            "adresse": str(row['Adresse']).strip(),
            "kommune": str(row['Kommune']).strip(),
            "omsetning": revenue,
            "kjedeProsent": chain_pct,
            "yoyVekst": extract_yoy(row['YoY-vekst']),
            "ansatteLokalt": local_emp,
            "ansatteKjede": chain_emp_total,
            "kjedeLokasjoner": chain_locations,
            "markedsandel": extract_market_share(row['Markedsandel'])
        }
        actors.append(actor)

    # Beregn kategori-statistikk
    category_stats = {}
    for actor in actors:
        cat = actor['type']
        if cat not in category_stats:
            category_stats[cat] = {
                'count': 0,
                'totalRevenue': 0,
                'avgRevenue': 0
            }
        category_stats[cat]['count'] += 1
        if actor['omsetning']:
            category_stats[cat]['totalRevenue'] += actor['omsetning']

    for cat in category_stats:
        if category_stats[cat]['count'] > 0:
            category_stats[cat]['avgRevenue'] = category_stats[cat]['totalRevenue'] / category_stats[cat]['count']

    # Lag output
    output = {
        'actors': actors,
        'categoryStats': category_stats,
        'metadata': {
            'totalActors': len(actors),
            'totalCategories': len(category_stats),
            'generatedAt': pd.Timestamp.now().isoformat() + 'Z'
        }
    }

    # Lagre til JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Print sammendrag
    print(f"✅ AKTØRER PROSESSERT")
    print("=" * 80)
    print(f"✓ Totalt aktører: {len(actors)}")
    print(f"✓ Kategorier: {len(category_stats)}")
    print(f"✓ Output: {output_path}")

    print(f"\nKategorier:")
    print("-" * 80)
    for cat, stats in sorted(category_stats.items(), key=lambda x: x[1]['count'], reverse=True):
        print(f"  {cat:<40} {stats['count']:3d} bedrifter")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Bruk: python3 process_aktor_csv.py <csv_fil> <eiendom_id>")
        print("Eksempel: python3 process_aktor_csv.py '/path/to/aktorer.csv' 'brenneriveien-9'")
        sys.exit(1)

    csv_file = sys.argv[1]
    eiendom_id = sys.argv[2]

    # Bestem output path
    project_root = Path(__file__).parent.parent
    output_file = project_root / "src" / "data" / "aktorer" / f"{eiendom_id}.json"

    process_csv(csv_file, output_file)
```

---

### 3. Kjør Scriptet

**Syntax:**
```bash
python3 scripts/process_aktor_csv.py <path_to_csv> <eiendom_id>
```

**Eksempel for Brenneriveien 9:**
```bash
python3 scripts/process_aktor_csv.py \
  "/Users/gabrielboen/Downloads/Brenneriveien 9 /Brenneriveien 9 Aktør liste  - Sheet1.csv" \
  "brenneriveien-9"
```

**Output:**
```
✅ AKTØRER PROSESSERT
================================================================================
✓ Totalt aktører: 119
✓ Kategorier: 12
✓ Output: /Users/gabrielboen/place-analysis-lokka/src/data/aktorer/brenneriveien-9.json

Kategorier:
--------------------------------------------------------------------------------
  Mat og opplevelser / Restaurant           57 bedrifter
  Handel / Mat og drikke                    15 bedrifter
  Handel / Klesbutikker                      9 bedrifter
  ...
```

---

### 4. Verifiser Resultat

**Sjekk at JSON-filen ble opprettet:**
```bash
ls -lh src/data/aktorer/brenneriveien-9.json
```

**Test siden:**
```
http://localhost:3001/eiendommer/brenneriveien-9
```

Aktørlisten vil automatisk vises nederst på siden hvis JSON-filen eksisterer.

---

## Feilsøking

### Problem: "No such file or directory"
**Løsning:** Sjekk at CSV-stien er korrekt. Bruk absolutt sti hvis relativ sti ikke fungerer.

### Problem: "KeyError: 'Omsetning'"
**Løsning:** CSV mangler påkrevde kolonner. Verifiser kolonne-navn matcher nøyaktig.

### Problem: Aktørliste vises ikke på siden
**Løsning:**
1. Sjekk at JSON-filen ligger i `/src/data/aktorer/`
2. Sjekk at filnavnet matcher eiendom-ID: `{eiendom-id}.json`
3. Restart dev-serveren

---

## Output Format (JSON)

```json
{
  "actors": [
    {
      "rank": "#1",
      "navn": "Kiwi Minipris Fredensborg",
      "type": "Handel / Mat og drikke",
      "adresse": "MØLLERGATA 56",
      "kommune": "Oslo",
      "omsetning": 77,
      "kjedeProsent": "0.1%",
      "yoyVekst": -6.0,
      "ansatteLokalt": 22,
      "ansatteKjede": 14292,
      "kjedeLokasjoner": 725,
      "markedsandel": 5.46
    }
  ],
  "categoryStats": {
    "Mat og opplevelser / Restaurant": {
      "count": 57,
      "totalRevenue": 1234,
      "avgRevenue": 21.6
    }
  },
  "metadata": {
    "totalActors": 119,
    "totalCategories": 12,
    "generatedAt": "2025-01-11T00:00:00Z"
  }
}
```

---

## Quick Reference

**En-kommando prosess:**
```bash
# Erstatt med dine verdier
CSV_FILE="/path/to/aktorer.csv"
EIENDOM_ID="eiendom-navn"

python3 scripts/process_aktor_csv.py "$CSV_FILE" "$EIENDOM_ID"
```

**Verifiser:**
```bash
cat "src/data/aktorer/${EIENDOM_ID}.json" | grep totalActors
```

---

## Tips

1. **Batch-prosessering**: Lag en liste over CSV-filer og kjør scriptet i loop
2. **Automatisk validering**: Scriptet validerer data automatisk
3. **Ingen duplikater**: Samme eiendom-ID overskriver eksisterende data
4. **Valgfritt**: Aktørdata er valgfri - sider fungerer uten

---

*Oppdatert: 11. januar 2025*
