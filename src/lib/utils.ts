import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes uten konflikter
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formater norsk valuta
 */
export function formaterNOK(belop: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 0,
  }).format(belop);
}

/**
 * Formater tall med tusenskiller
 */
export function formaterTall(tall: number): string {
  return new Intl.NumberFormat('nb-NO').format(tall);
}

/**
 * Formater dato til norsk format
 */
export function formaterDato(datoString: string): string {
  const dato = new Date(datoString);
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dato);
}

/**
 * Generer slug fra tekst
 */
export function genererSlug(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Fjern diakritiske tegn
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
