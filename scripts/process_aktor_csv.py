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
