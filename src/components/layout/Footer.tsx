export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-lokka-primary">
              Place Analysis Løkka
            </h3>
            <p className="text-sm text-gray-600">
              Placeanalyser og eiendomsinformasjon for Løkka Gårdeierforening.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-lokka-primary">
              Lenker
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/eiendommer" className="text-gray-600 hover:text-lokka-primary">
                  Eiendommer
                </a>
              </li>
              <li>
                <a href="/om-prosjektet" className="text-gray-600 hover:text-lokka-primary">
                  Om Prosjektet
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-lokka-primary">
              Kontakt
            </h3>
            <p className="text-sm text-gray-600">
              Løkka Gårdeierforening<br />
              Oslo, Norge
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          © {year} Løkka Gårdeierforening. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  );
}
