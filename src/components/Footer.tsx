import { Link } from 'react-router';
import { Flame, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-sand mt-20 text-ink-muted text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-spruce flex items-center justify-center text-paper">
                <Flame className="w-4 h-4 text-copper" />
              </div>
              <span className="font-serif text-lg font-bold text-ink">Varmeverdi</span>
            </div>
            <p className="text-ink-muted max-w-md text-sm leading-relaxed">
              Forenklet fagverktøy for vurdering og grovkalkyle av overskuddsvarme etter energiloven og
              forskrift om kost-nytteanalyse (FOR-2024-09-25-2263).
            </p>
            <div className="flex items-center gap-2 text-xs text-ink-muted/80">
              <ShieldCheck className="w-4 h-4 text-spruce" />
              <span>Kjører 100 % i nettleseren. Ingen lagring av sensitive anleggsdata.</span>
            </div>
          </div>

          {/* Sider */}
          <div>
            <h4 className="font-serif font-semibold text-ink mb-3 text-base">Moduler</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/kalkulator" className="hover:text-spruce transition-colors">
                  Overskuddsvarme-kalkulator
                </Link>
              </li>
              <li>
                <Link to="/kart" className="hover:text-spruce transition-colors">
                  Forenklet kart & rørtrasé
                </Link>
              </li>
              <li>
                <Link to="/regelverk" className="hover:text-spruce transition-colors">
                  Forskrift & KNA-plikt
                </Link>
              </li>
            </ul>
          </div>

          {/* Eksterne referanser */}
          <div>
            <h4 className="font-serif font-semibold text-ink mb-3 text-base">Offisielle kilder</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://lovdata.no/forskrift/2024-09-25-2263"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-spruce transition-colors"
                >
                  FOR-2024-09-25-2263 (Lovdata)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nve.no"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-spruce transition-colors"
                >
                  NVE — Norges vassdrags- og energidirektorat
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://kartverket.no"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-spruce transition-colors"
                >
                  Kartverket (Geodata)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sand/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted/70 gap-4">
          <p>© {new Date().getFullYear()} Varmeverdi. Frittstående beregningsverktøy.</p>
          <p>Beregningene er veiledende og erstatter ikke en formell detaljutredning.</p>
        </div>
      </div>
    </footer>
  );
}
