import fs from 'fs/promises';
import path from 'path';
import { validerEiendomsdata, validerEiendomsdataSafe } from './validation';
import type { Eiendom } from '@/types/eiendom';

const DATA_DIR = path.join(process.cwd(), 'src/data/eiendommer');

/**
 * Last alle eiendommer fra data-mappen
 */
export async function lastAlleEiendommer(): Promise<Eiendom[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(
      (file) => file.endsWith('.json') && file !== 'template.json'
    );

    const eiendommer = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);

        // Valider data
        const validert = validerEiendomsdataSafe(data);

        if (!validert.success) {
          console.error(`Valideringsfeil i ${file}:`, validert.error);
          throw new Error(`Ugyldig data i ${file}`);
        }

        return validert.data;
      })
    );

    // Sorter etter adresse
    return eiendommer.sort((a, b) => a.adresse.localeCompare(b.adresse, 'nb'));
  } catch (error) {
    console.error('Feil ved lasting av eiendommer:', error);
    return [];
  }
}

/**
 * Last en spesifikk eiendom basert på ID
 */
export async function lastEiendom(id: string): Promise<Eiendom | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    return validerEiendomsdata(data);
  } catch (error) {
    console.error(`Feil ved lasting av eiendom ${id}:`, error);
    return null;
  }
}

/**
 * Hent alle eiendom-ID-er for statisk generering
 */
export async function hentAlleEiendomsIder(): Promise<string[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    return files
      .filter((file) => file.endsWith('.json') && file !== 'template.json')
      .map((file) => file.replace('.json', ''));
  } catch (error) {
    console.error('Feil ved henting av eiendom-IDer:', error);
    return [];
  }
}
