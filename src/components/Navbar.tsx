import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Flame, Calculator, MapPin, BookOpen, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Kalkulator', path: '/kalkulator', icon: Calculator },
    { name: 'Kartvisning', path: '/kart', icon: MapPin },
    { name: 'Regelverk & Plikt', path: '/regelverk', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-spruce flex items-center justify-center text-paper shadow-sm group-hover:bg-spruce-deep transition-colors">
              <Flame className="w-5 h-5 text-copper group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-ink">Varmeverdi</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-sand/60 text-ink-muted">
                Forenklet utgave
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-spruce/10 text-spruce font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-sand/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-spruce' : 'text-ink-muted'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/kalkulator"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-copper hover:bg-copper-hover text-surface text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              Start kalkylen
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-ink-muted hover:text-ink hover:bg-sand/50"
              aria-label="Meny"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand bg-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium ${
                  active
                    ? 'bg-spruce/10 text-spruce font-semibold'
                    : 'text-ink-muted hover:text-ink hover:bg-sand/40'
                }`}
              >
                <Icon className="w-5 h-5 text-spruce" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/kalkulator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-copper text-surface font-semibold text-sm shadow-sm"
            >
              Start kalkylen
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
