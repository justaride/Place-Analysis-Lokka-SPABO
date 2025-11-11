import { Card, CardContent } from '@/components/ui/Card';

export default function EiendomsprofilContent() {
  return (
    <section className="mb-12">
      <Card>
        <CardContent className="prose prose-lg max-w-none p-8 lg:p-12">
          <h1 className="mb-8 border-b-4 border-lokka-primary pb-4 text-4xl font-bold text-lokka-primary">
            BRENNERIVEIEN 5 – EIENDOMSPROFIL
          </h1>

          {/* Nøkkeldata */}
          <div className="mb-12 rounded-lg bg-lokka-light p-6">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">NØKKELDATA</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-700">Adresse:</p>
                <p className="text-gray-900">Brenneriveien 5, 0182 Oslo</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Bydel:</p>
                <p className="text-gray-900">Grünerløkka, Fredensborg</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Matrikkel:</p>
                <p className="text-gray-900">Gnr. 208, Bnr. 62 (0301-208/62)</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Koordinater:</p>
                <p className="text-gray-900">59.9198549°N, 10.7520967°E</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Eier:</p>
                <p className="text-gray-900">Brenneriveien 5 AS (Org.nr. 993 637 726)</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Forvalter:</p>
                <p className="text-gray-900">Spabo Eiendom AS</p>
              </div>
            </div>
          </div>

          {/* Bygningstekniske Spesifikasjoner */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
              BYGNINGSTEKNISKE SPESIFIKASJONER
            </h2>

            <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">
              Dimensjoner og Struktur
            </h3>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li><strong>Totalareal:</strong> 2 545 m² BTA</li>
              <li><strong>Antall etasjer:</strong> 5 etasjer + kjeller</li>
              <li><strong>Rentable etasjer:</strong> 4 etasjer à ca. 500 m² hver</li>
              <li><strong>Kjellerareal:</strong> 213 m² (garasje, 7 bilplasser)</li>
              <li><strong>Konstruksjon:</strong> Plasstøpt betong med spekkmuret teglfasade</li>
              <li><strong>Byggeår:</strong> 1966</li>
              <li><strong>Arkitekt:</strong> Ukjent</li>
            </ul>

            <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">
              Tekniske Systemer
            </h3>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li><strong>Heis:</strong> Installert 2013, direkte tilgang til enheter</li>
              <li><strong>Oppvarming:</strong> Vannbåren via elektrisk kjel med radiatorer</li>
              <li><strong>Ventilasjon:</strong> Felles ventilasjonsanlegg med kjøling</li>
              <li><strong>Energimerking:</strong> F (rød)</li>
              <li><strong>Sikkerhet:</strong> Elektronisk brannalarm, adgangskontroll, Securitasvaktavtale</li>
              <li><strong>Infrastruktur:</strong> Fiber, moderne elektrisk anlegg</li>
            </ul>

            <h3 className="mb-4 text-xl font-semibold text-lokka-neutral">Fasiliteter</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Stor felles takterrasse</li>
              <li>Sykkelparkering i bakgård</li>
              <li>Brenneriet Café (1. etasje)</li>
              <li>Møterom og sosiale soner</li>
              <li>Kjøkken/spiserom med dusj</li>
            </ul>
          </div>

          {/* Historikk og Utvikling */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
              HISTORIKK OG UTVIKLING
            </h2>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              Opprinnelse (1966-2000-tallet)
            </h3>
            <p className="mb-6 text-gray-700">
              Bygget ble oppført i 1966 som industribygg i sluttfasen av Oslos industriepoke
              langs Akerselva. Eiendommen fungerte som produksjonsbygg gjennom industriens
              nedgangsperiode på 1970-80-tallet. Bygningen representerer siste generasjon
              industrilokaler i området før deindustrialiseringen transformerte elvekorridoren.
            </p>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              Tidlig 2000-tall: Anthon B. Nilsen-perioden
            </h3>
            <p className="mb-6 text-gray-700">
              Anthon B. Nilsen Eiendom AS etablerte enkeltformålsselskapet Brenneriveien 5 AS
              (stiftet 13. januar 2009) og gjennomførte omfattende renovering for å transformere
              bygget til moderne kontorbygg. Prosjektet fokuserte på å bevare industriell karakter
              samtidig som det tilrettela for kreative næringer.
            </p>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              2013-2016: Modernisering
            </h3>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>2013: Ny heis installert parallelt med trappeløp</li>
              <li>2016: Komplett renovering ferdigstilt med ventilasjon, kjøling, sikkerhetssystemer</li>
              <li>Februar 2016: Eiendommen markedsført for salg via Akershus Eiendom
                <ul className="ml-6 mt-2 space-y-1">
                  <li>Estimert verdi: ca. 65 MNOK</li>
                  <li>Netto leieinntekter: 4,0 MNOK</li>
                  <li>Yield: ca. 6%</li>
                </ul>
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              2016-i dag: Spabo-perioden
            </h3>
            <p className="text-gray-700">
              Spabo Næring AS overtok aksjer i Brenneriveien 5 AS i 2016. Eiendommen drives som
              stabil utleieeiendom med fokus på kulturelle og kreative næringer, i tråd med
              områdets profil og Spabos porteføljestrategi.
            </p>
          </div>

          {/* Eierskap og Selskapsstruktur */}
          <div className="mb-12 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
              EIERSKAP OG SELSKAPSSTRUKTUR
            </h2>

            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
                Juridisk eier: BRENNERIVEIEN 5 AS
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Stiftet:</strong> 13. januar 2009</li>
                <li><strong>Org.nr:</strong> 993 637 726</li>
                <li><strong>Formål:</strong> "Utvikling og drift av fast eiendom, herunder erverv av tomter og bygg, samt deltakelse i andre eiendomsselskaper"</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-lokka-neutral">Eierkjede:</h3>
              <div className="space-y-2 pl-4 text-gray-700">
                <p>Spabogruppen (Spandow-familien)</p>
                <p className="pl-4">↓</p>
                <p className="pl-4">Spabo AS (konsernforelder)</p>
                <p className="pl-8">↓</p>
                <p className="pl-8">Spabo Næring AS (100% eier)</p>
                <p className="pl-12">↓</p>
                <p className="pl-12 font-semibold">BRENNERIVEIEN 5 AS (enkelteiendom)</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-lokka-neutral">
                Daglig drift: Spabo Eiendom AS
              </h3>
              <p className="mb-2 text-gray-700">Adresse: Smeltedigelen 1, 0195 Oslo</p>
              <p className="mb-4 text-gray-700">Kontakt: 23 22 29 00</p>

              <p className="mb-2 font-semibold text-gray-800">Nøkkelpersoner:</p>
              <ul className="space-y-1 text-gray-700">
                <li>Daglig leder: Anne Kari Søvik (f. 1965)</li>
                <li>Styreleder: Jan Spandow (f. 1971)</li>
                <li>Styremedlemmer: Ariane Spandow, Arild Spandow</li>
              </ul>
            </div>
          </div>

          {/* Økonomiske Nøkkeltall */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
              ØKONOMISKE NØKKELTALL (2021)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-lokka-primary text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left">Parameter</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Verdi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-4 py-2">Driftsinntekter</td>
                    <td className="border border-gray-300 px-4 py-2">5 230 000 NOK</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Årsresultat</td>
                    <td className="border border-gray-300 px-4 py-2">139 000 NOK</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-4 py-2">Egenkapital</td>
                    <td className="border border-gray-300 px-4 py-2">6 187 000 NOK</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Gjeld</td>
                    <td className="border border-gray-300 px-4 py-2">47 052 000 NOK</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-4 py-2">Gjeld/EK-ratio</td>
                    <td className="border border-gray-300 px-4 py-2">7,6:1</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Estimert markedsverdi (2025)</td>
                    <td className="border border-gray-300 px-4 py-2">55-70 MNOK</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-4 py-2">Estimert leie per m²/år</td>
                    <td className="border border-gray-300 px-4 py-2">1 690 NOK</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Nåværende Bruk */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
              NÅVÆRENDE BRUK OG LEIETAKERE
            </h2>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">Profil</h3>
            <p className="mb-6 text-gray-700">
              Eiendommen posisjoneres som "utleieobjekt for kulturindustrien eller andre kreative
              næringer" med 13 kommersielle leietakere.
            </p>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              Identifiserte leietakere (aktive/historiske)
            </h3>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li><strong>Brenneriet Café</strong> – kafé i 1. etasje</li>
              <li><strong>Kulturmeglerne AS</strong> – PR/kommunikasjon, kultur (3. etasje)</li>
              <li><strong>Reactor Retail</strong> – design/branding</li>
              <li><strong>Design Without Borders</strong> – utviklingsorganisasjon</li>
              <li><strong>Conventor AS</strong> – konferanse/events</li>
              <li><strong>Degree of Freedom AS</strong> – diverse virksomhet</li>
              <li>Flere kreative og kulturelle virksomheter</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              Utleiestatus (november 2025)
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Ledig areal:</strong> 4. etasje (530 m² BTA + valgfritt 200 m²)</li>
              <li><strong>Garasje:</strong> 213 m² tilgjengelig</li>
              <li><strong>Belegg:</strong> Estimert 70-85%</li>
            </ul>
          </div>

          {/* Beliggenhet og Kontekst */}
          <div className="mb-12 rounded-lg bg-lokka-light p-6">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">
              BELIGGENHET OG KONTEKST
            </h2>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              Strategisk posisjon
            </h3>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>Ved Akerselva miljøpark – nasjonalt kulturminneområde</li>
              <li>Nabo til Vulkan – matdestinasjon og kulturhub</li>
              <li>Ved Blå – ikonisk musikksted (Brenneriveien 9)</li>
              <li>Gatekunstdestinasjon – Brenneriveien er Norges første gatekunstområde</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">Tilgjengelighet</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Walk Score:</strong> 98/100 (Walker's Paradise)</li>
              <li><strong>Nærmeste kollektivstopp:</strong> Møllerveien (238 m, 4 min)</li>
              <li><strong>Kollektivlinjer:</strong> 12+ busslinjer, metro, tram</li>
              <li><strong>Sykkelvennlig:</strong> 180 km sykkelbaner, Akerselva-sti umiddelbar tilgang</li>
            </ul>
          </div>

          {/* Regulatorisk Status */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-lokka-primary">REGULATORISK STATUS</h2>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">Gjeldende planer</h3>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li><strong>Kommuneplan 2015:</strong> Nåværende bebyggelse og anlegg</li>
              <li><strong>KDP Akerselva miljøpark (1990):</strong> Spesialområde bevaring</li>
              <li><strong>Vernestatus:</strong> Ikke individuelt fredet, men i nasjonalt kulturminneområde</li>
              <li><strong>Formål:</strong> Kontor/forretning, mulig blandet bruk</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-lokka-neutral">
              Utbyggingspotensial
            </h3>
            <p className="mb-4 text-gray-700">
              Eiendommen ligger i område med strenge bevaringshensyn. Fylkesmannen opphevet i 2018
              PBEs rammetillatelse for påbygg, med begrunnelse at bygget allerede overstiger
              områdets dominerende høyde. Pågående detaljreguleringsak (202016180) møter betydelig
              motstand fra verneinteresser.
            </p>
            <p className="font-semibold text-lokka-primary">
              Konklusjon: Utviklingspotensial primært begrenset til optimalisering av eksisterende
              bygningsmasse.
            </p>
          </div>

          {/* Merkevareposisjonering */}
          <div className="rounded-lg bg-gradient-to-br from-lokka-primary to-lokka-secondary p-8 text-white">
            <h2 className="mb-6 text-2xl font-bold">MERKEVAREPOSISJONERING</h2>
            <p className="mb-4">Brenneriveien 5 markedsføres med fokus på:</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-3 text-2xl">✓</span>
                <span>Autentisk industriell karakter i verneverdig miljø</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">✓</span>
                <span>Kreativ klynge og kulturelt nettverk</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">✓</span>
                <span>Unik beliggenhet ved Akerselva og Vulkan</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">✓</span>
                <span>Fleksible lokaler med høye takhøyder og godt lys</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">✓</span>
                <span>Moderne fasiliteter i historisk ramme</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">✓</span>
                <span>Premium lokalisering til konkurransedyktig pris (mid-range segment)</span>
              </li>
            </ul>

            <div className="mt-8 border-t border-white/30 pt-6">
              <p className="text-sm text-white/80">
                <strong>Sist oppdatert:</strong> November 2025
              </p>
              <p className="mt-2 text-sm text-white/80">
                <strong>Kilder:</strong> Oslo kommune eiendomsregister, Kartverket, Finn.no,
                Brønnøysundregistrene, Proff.no, Estate Nyheter, Spabo Eiendom
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
