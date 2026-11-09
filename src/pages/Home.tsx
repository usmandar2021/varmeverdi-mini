import { Link } from 'react-router';
import { ArrowRight, Calculator, MapPin, BookOpen, CheckCircle2, Zap, Layers, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-sand/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/70 text-ink text-xs font-medium tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-copper" />
            <span>Forenklet fagverktøy for overskuddsvarme</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-ink tracking-tight leading-[1.15]">
            Verdien av overskuddsvarme, <br />
            <span className="text-spruce">enkelt beregnet.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-ink-muted leading-relaxed">
            Gjør en rask innledende vurdering av spillvarmepotensial, varmepumpe-COP, rørtrasékostnad
            og prosjektøkonomi etter forskrift om kost-nytteanalyse (FOR-2024-09-25-2263).
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/kalkulator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-copper hover:bg-copper-hover text-surface text-base font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <Calculator className="w-5 h-5" />
              Åpne overskuddsvarmekalkulator
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/kart"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface hover:bg-sand/40 text-ink text-base font-medium border border-sand transition-all"
            >
              <MapPin className="w-5 h-5 text-spruce" />
              Utforsk kart & trasé
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            Tre verktøy i ett grensesnitt
          </h2>
          <p className="text-ink-muted mt-2 text-sm sm:text-base">
            Alt du trenger for en rask vurdering uten innlogging eller komplekse installasjoner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Kalkulator */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-sand shadow-sm hover:border-spruce/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber/20 flex items-center justify-center text-copper">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-ink">Lønnsomhetskalkulator</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Beregn levert varmeenergi (GWh/år), realistisk varmepumpe-COP etter Carnot-modell,
                investeringsramme, enkel tilbakebetalingstid og nåverdi (NPV).
              </p>
              <ul className="space-y-2 text-xs text-ink/80 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Justerbar effekt (kW/MW) og temperaturheving</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Sensitivitetsanalyse på strøm- og varmepris</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Utskriftsvennlig kalkyleresultat</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                to="/kalkulator"
                className="inline-flex items-center gap-2 text-sm font-semibold text-spruce hover:text-spruce-deep"
              >
                Gå til kalkulator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Kartvisning */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-sand shadow-sm hover:border-spruce/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-spruce/10 flex items-center justify-center text-spruce">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-ink">Kart & rørtrasé</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Marker kilden og potensiell mottaker eller fjernvarmenett direkte i kartet over Norge.
                Få nøyaktig avstandsmåling og estimert trasékostnad.
              </p>
              <ul className="space-y-2 text-xs text-ink/80 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Kartverkets åpne topografiske norgeskart</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Valgfri søkeradius (500m til 5 km)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Ett klikk overfører rørkostnad til kalkylen</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                to="/kart"
                className="inline-flex items-center gap-2 text-sm font-semibold text-spruce hover:text-spruce-deep"
              >
                Åpne kartvisning <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Regelverk */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-sand shadow-sm hover:border-spruce/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal/15 flex items-center justify-center text-teal">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-ink">Forskrift & KNA-plikt</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Få klarhet i kravene i FOR-2024-09-25-2263: Hvilke anlegg har plikt til å gjennomføre
                kost-nytteanalyse, hvilke terskelverdier gjelder, og hva må rapporten belyse?
              </p>
              <ul className="space-y-2 text-xs text-ink/80 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>§ 5 Terskelverdier (2 MW / 10 MW / 20 MW)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Hovedtrinnene i en forskriftsmessig analyse</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spruce" />
                  <span>Offisielle kildehenvisninger til Lovdata & NVE</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                to="/regelverk"
                className="inline-flex items-center gap-2 text-sm font-semibold text-spruce hover:text-spruce-deep"
              >
                Les om regelverket <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-surface rounded-3xl p-8 sm:p-12 border border-sand">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-copper">Metodikk</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-1">
              Fra spillvarme til lønnsomt prosjekt
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-sand/70 text-ink font-serif font-bold flex items-center justify-center text-lg">
                1
              </div>
              <h4 className="font-serif font-bold text-ink text-lg">Karakteriser varmen</h4>
              <p className="text-ink-muted text-sm leading-relaxed">
                Fastslå tilgjengelig effekt (kW/MW), temperatur på kilden (°C) og hvor mange driftstimer
                anlegget har i løpet av et år.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-sand/70 text-ink font-serif font-bold flex items-center justify-center text-lg">
                2
              </div>
              <h4 className="font-serif font-bold text-ink text-lg">Finn avtager & trasé</h4>
              <p className="text-ink-muted text-sm leading-relaxed">
                Bruk kartet til å måle avstand til nærmeste varmebehov eller fjernvarmenett. Rørtraséen
                utgjør ofte en vesentlig del av investeringsbehovet.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-sand/70 text-ink font-serif font-bold flex items-center justify-center text-lg">
                3
              </div>
              <h4 className="font-serif font-bold text-ink text-lg">Vurder lønnsomhet</h4>
              <p className="text-ink-muted text-sm leading-relaxed">
                Kjør kalkylen med antatt kraftpris og oppnåelig varmepris. Se om prosjektet gir positiv
                netto nåverdi (NPV) og akseptabel tilbakebetalingstid.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
