/**
 * Typer for Plaace-rapportdata
 */

export type PlaaceKategori =
  | 'oversikt'
  | 'demografi'
  | 'marked'
  | 'utvikling'
  | 'infrastruktur'
  | 'annet';

export interface PlaaceScreenshot {
  id: string;
  eiendomId: string;
  kategori: PlaaceKategori;
  filnavn: string;
  fullPath: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface PlaaceMetadata {
  versjon: string;
  rapportType: string;
  genereringsDato: string;
}
