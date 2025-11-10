#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import { validerEiendomsdataSafe } from '../src/lib/validation';

const DATA_DIR = path.join(process.cwd(), 'src/data/eiendommer');

async function validerAlleEiendommer() {
  console.log('🔍 Validerer eiendomsdata...\n');

  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(
      (file) => file.endsWith('.json') && file !== 'template.json'
    );

    if (jsonFiles.length === 0) {
      console.log('⚠️  Ingen eiendomsfiler funnet (bortsett fra template.json)');
      return;
    }

    let antallFeil = 0;
    let antallOK = 0;

    for (const file of jsonFiles) {
      const filePath = path.join(DATA_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');

      try {
        const data = JSON.parse(content);
        const resultat = validerEiendomsdataSafe(data);

        if (!resultat.success) {
          console.error(`❌ ${file}:`);
          console.error(resultat.error.format());
          antallFeil++;
        } else {
          // Sjekk at screenshot-filer faktisk eksisterer
          const manglendeBilder: string[] = [];

          for (const screenshot of resultat.data.plaaceData.screenshots) {
            const bildePath = path.join(process.cwd(), 'public', screenshot.path);
            try {
              await fs.access(bildePath);
            } catch {
              manglendeBilder.push(screenshot.path);
            }
          }

          if (manglendeBilder.length > 0) {
            console.error(`⚠️  ${file}: Manglende bilder:`);
            manglendeBilder.forEach((bilde) => console.error(`   - ${bilde}`));
            antallFeil++;
          } else {
            console.log(`✅ ${file}`);
            antallOK++;
          }
        }
      } catch (error) {
        console.error(`❌ ${file}: Ugyldig JSON`);
        console.error(error);
        antallFeil++;
      }
    }

    console.log(`\n📊 Resultater:`);
    console.log(`   ✅ OK: ${antallOK}`);
    console.log(`   ❌ Feil: ${antallFeil}`);

    if (antallFeil > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Feil ved validering:', error);
    process.exit(1);
  }
}

validerAlleEiendommer();
