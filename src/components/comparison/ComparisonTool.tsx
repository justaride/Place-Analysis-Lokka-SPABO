'use client';

import { useState, useEffect } from 'react';
import { Eiendom } from '@/types/eiendom';
import Container from '@/components/ui/Container';
import Link from 'next/link';
import Image from 'next/image';

export default function ComparisonTool() {
  const [eiendommer, setEiendommer] = useState<Eiendom[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string>('');
  const [selectedRight, setSelectedRight] = useState<string>('');
  const [leftEiendom, setLeftEiendom] = useState<Eiendom | null>(null);
  const [rightEiendom, setRightEiendom] = useState<Eiendom | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all properties
  useEffect(() => {
    async function fetchEiendommer() {
      try {
        const response = await fetch('/api/eiendommer');
        const data = await response.json();
        setEiendommer(data);

        // Set defaults
        if (data.length >= 2) {
          setSelectedLeft(data[0].id);
          setSelectedRight(data[1].id);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEiendommer();
  }, []);

  // Fetch detailed data for selected properties
  useEffect(() => {
    async function fetchDetails() {
      if (!selectedLeft) return;
      try {
        const response = await fetch(`/api/eiendommer/${selectedLeft}`);
        const data = await response.json();
        setLeftEiendom(data);
      } catch (error) {
        console.error('Failed to fetch left property:', error);
      }
    }
    fetchDetails();
  }, [selectedLeft]);

  useEffect(() => {
    async function fetchDetails() {
      if (!selectedRight) return;
      try {
        const response = await fetch(`/api/eiendommer/${selectedRight}`);
        const data = await response.json();
        setRightEiendom(data);
      } catch (error) {
        console.error('Failed to fetch right property:', error);
      }
    }
    fetchDetails();
  }, [selectedRight]);

  if (loading) {
    return (
      <Container className="py-20">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-lokka-primary border-r-transparent"></div>
          <p className="mt-4 text-lokka-secondary">Laster eiendommer...</p>
        </div>
      </Container>
    );
  }

  const ComparisonRow = ({
    label,
    leftValue,
    rightValue,
    highlight = false
  }: {
    label: string;
    leftValue: string | number | null | undefined;
    rightValue: string | number | null | undefined;
    highlight?: boolean;
  }) => {
    const leftStr = leftValue?.toString() || '-';
    const rightStr = rightValue?.toString() || '-';
    const isDifferent = leftStr !== rightStr;

    return (
      <tr className={`border-b border-gray-200/50 transition-colors hover:bg-lokka-light/30 ${highlight ? 'bg-lokka-light/20' : ''}`}>
        <td className="px-4 py-4 text-sm font-semibold text-lokka-secondary md:px-6">{label}</td>
        <td className={`px-4 py-4 text-sm md:px-6 ${isDifferent && highlight ? 'font-bold text-lokka-primary' : 'text-lokka-secondary'}`}>
          {leftStr}
        </td>
        <td className={`px-4 py-4 text-sm md:px-6 ${isDifferent && highlight ? 'font-bold text-lokka-primary' : 'text-lokka-secondary'}`}>
          {rightStr}
        </td>
      </tr>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200/30 bg-gradient-to-br from-lokka-primary via-lokka-secondary to-lokka-accent py-12 text-white md:py-20">
        <Container>
          <Link
            href="/eiendommer"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <span>←</span> Tilbake til oversikt
          </Link>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Sammenlign Eiendommer
          </h1>
          <p className="max-w-2xl text-lg text-white/90 md:text-xl">
            Se nøkkeltall og data side-om-side for å finne den beste eiendommen for dine behov
          </p>
        </Container>
      </section>

      {/* Selectors */}
      <Container className="py-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Selector */}
          <div>
            <label htmlFor="left-select" className="mb-3 block text-sm font-semibold text-lokka-secondary">
              Velg eiendom 1:
            </label>
            <select
              id="left-select"
              value={selectedLeft}
              onChange={(e) => setSelectedLeft(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-lokka-primary shadow-soft transition-all hover:border-lokka-primary focus:border-lokka-primary focus:outline-none focus:ring-2 focus:ring-lokka-primary/20"
            >
              {eiendommer.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.adresse}
                </option>
              ))}
            </select>
          </div>

          {/* Right Selector */}
          <div>
            <label htmlFor="right-select" className="mb-3 block text-sm font-semibold text-lokka-secondary">
              Velg eiendom 2:
            </label>
            <select
              id="right-select"
              value={selectedRight}
              onChange={(e) => setSelectedRight(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-lokka-primary shadow-soft transition-all hover:border-lokka-primary focus:border-lokka-primary focus:outline-none focus:ring-2 focus:ring-lokka-primary/20"
            >
              {eiendommer.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.adresse}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              const temp = selectedLeft;
              setSelectedLeft(selectedRight);
              setSelectedRight(temp);
            }}
            className="flex items-center gap-2 rounded-xl border-2 border-lokka-primary bg-white px-6 py-3 text-sm font-semibold text-lokka-primary shadow-soft transition-all hover:bg-lokka-primary hover:text-white hover:shadow-medium"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Bytt eiendommer
          </button>
        </div>
      </Container>

      {/* Comparison Table */}
      {leftEiendom && rightEiendom && (
        <Container className="pb-20">
          {/* Images */}
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-medium">
              {leftEiendom.heroImage && (
                <div className="relative h-64 w-full">
                  <Image
                    src={leftEiendom.heroImage}
                    alt={leftEiendom.adresse}
                    fill
                    className="object-cover"
                    quality={85}
                  />
                </div>
              )}
              <div className="bg-gradient-to-br from-lokka-primary to-lokka-secondary p-6 text-white">
                <h2 className="text-2xl font-bold">{leftEiendom.adresse}</h2>
                <p className="mt-2 text-sm text-white/80">{leftEiendom.beskrivelse}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-medium">
              {rightEiendom.heroImage && (
                <div className="relative h-64 w-full">
                  <Image
                    src={rightEiendom.heroImage}
                    alt={rightEiendom.adresse}
                    fill
                    className="object-cover"
                    quality={85}
                  />
                </div>
              )}
              <div className="bg-gradient-to-br from-lokka-primary to-lokka-secondary p-6 text-white">
                <h2 className="text-2xl font-bold">{rightEiendom.adresse}</h2>
                <p className="mt-2 text-sm text-white/80">{rightEiendom.beskrivelse}</p>
              </div>
            </div>
          </div>

          {/* Comparison Data */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-medium">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200/50 bg-lokka-light">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-lokka-primary md:px-6">
                      Nøkkeltall
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-lokka-primary md:px-6">
                      {leftEiendom.adresse.split(',')[0]}
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-lokka-primary md:px-6">
                      {rightEiendom.adresse.split(',')[0]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow
                    label="Gårdsnummer"
                    leftValue={leftEiendom.gnr}
                    rightValue={rightEiendom.gnr}
                  />
                  <ComparisonRow
                    label="Bruksnummer"
                    leftValue={leftEiendom.bnr}
                    rightValue={rightEiendom.bnr}
                  />
                  <ComparisonRow
                    label="Energimerke"
                    leftValue={leftEiendom.plaaceData.nokkeldata?.energimerke}
                    rightValue={rightEiendom.plaaceData.nokkeldata?.energimerke}
                    highlight
                  />
                  <ComparisonRow
                    label="Totalt areal"
                    leftValue={leftEiendom.plaaceData.nokkeldata?.areal}
                    rightValue={rightEiendom.plaaceData.nokkeldata?.areal}
                    highlight
                  />
                  <ComparisonRow
                    label="Kontorareal"
                    leftValue={leftEiendom.plaaceData.nokkeldata?.arealKontor}
                    rightValue={rightEiendom.plaaceData.nokkeldata?.arealKontor}
                  />
                  <ComparisonRow
                    label="Serveringsareal"
                    leftValue={leftEiendom.plaaceData.nokkeldata?.arealServering}
                    rightValue={rightEiendom.plaaceData.nokkeldata?.arealServering}
                  />
                  <ComparisonRow
                    label="Byggeår"
                    leftValue={leftEiendom.plaaceData.nokkeldata?.byggeaar}
                    rightValue={rightEiendom.plaaceData.nokkeldata?.byggeaar}
                    highlight
                  />
                  <ComparisonRow
                    label="Sist oppdatert"
                    leftValue={new Date(leftEiendom.metadata.sistOppdatert).toLocaleDateString('nb-NO')}
                    rightValue={new Date(rightEiendom.metadata.sistOppdatert).toLocaleDateString('nb-NO')}
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Link
              href={`/eiendommer/${leftEiendom.id}`}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-lokka-primary bg-lokka-primary px-8 py-4 text-base font-semibold text-white shadow-soft transition-all hover:bg-lokka-secondary hover:border-lokka-secondary hover:shadow-medium"
            >
              Se full profil
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`/eiendommer/${rightEiendom.id}`}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-lokka-primary bg-lokka-primary px-8 py-4 text-base font-semibold text-white shadow-soft transition-all hover:bg-lokka-secondary hover:border-lokka-secondary hover:shadow-medium"
            >
              Se full profil
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      )}
    </>
  );
}
