export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200/50 bg-lokka-light">
      <div className="mx-auto max-w-natural px-[4vw] py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-lokka-secondary">
              Kontakt
            </h4>
            <div className="space-y-2 text-sm text-lokka-neutral">
              <p>
                <a href="mailto:gabriel@naturalstate.no" className="hover:text-lokka-primary transition-colors">
                  gabriel@naturalstate.no
                </a>
              </p>
              <p>
                <a href="mailto:kim@naturalstate.no" className="hover:text-lokka-primary transition-colors">
                  kim@naturalstate.no
                </a>
              </p>
              <p>
                <a href="mailto:einar@naturalstate.no" className="hover:text-lokka-primary transition-colors">
                  einar@naturalstate.no
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-lokka-secondary">
              Lenker
            </h4>
            <ul className="space-y-2 text-sm text-lokka-neutral">
              <li>
                <a href="/eiendommer" className="hover:text-lokka-primary transition-colors">
                  Eiendommer
                </a>
              </li>
              <li>
                <a href="/om-prosjektet" className="hover:text-lokka-primary transition-colors">
                  Om Prosjektet
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-lokka-secondary">
              Sosiale Medier
            </h4>
            <ul className="space-y-2 text-sm text-lokka-neutral">
              <li>
                <a href="https://www.linkedin.com/company/20143755" target="_blank" rel="noopener noreferrer" className="hover:text-lokka-primary transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/newnaturalstate/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-lokka-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/naturalstateas/" target="_blank" rel="noopener noreferrer" className="hover:text-lokka-primary transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-lokka-secondary">
              Besøk
            </h4>
            <address className="text-sm not-italic text-lokka-neutral">
              St Halvards Gate 33<br />
              0193 Oslo<br />
              Norge
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200/50 pt-8">
          <p className="text-center text-xs text-lokka-secondary">
            © {year} Natural State AS. nature, human, society
          </p>
        </div>
      </div>
    </footer>
  );
}
