import { BookOpen, CheckCircle2, AlertCircle, FileText, ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Regelverk() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-sand pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal/15 text-teal text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Offisielt regelverk
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink">
          Forskrift om kost-nytteanalyse av overskuddsvarme
        </h1>
        <p className="text-ink-muted text-base mt-2 max-w-3xl leading-relaxed">
          Forskrift fastsatt av Energidepartementet med hjemmel i energiloven (FOR-2024-09-25-2263).
          Forskriften pålegger anleggseiere å gjennomføre en kost-nytteanalyse (KNA) av å utnytte
          overskuddsvarme før nye anlegg bygges eller vesentlig oppgraderes.
        </p>
      </div>

      {/* Terskelverdier (§ 5) */}
      <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-sand space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-copper">§ 5 Virkeområde</span>
          <h2 className="text-2xl font-serif font-bold text-ink mt-1">
            Hvilke anlegg er omfattet av plikten?
          </h2>
          <p className="text-ink-muted text-sm mt-1">
            Plikten gjelder ved planlegging av nye anlegg eller ved vesentlig oppgradering av eksisterende
            anlegg som overskrider følgende terskelverdier for samlet tilført effekt:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-xl bg-paper border border-sand space-y-2">
            <span className="text-xs font-bold uppercase text-spruce">Tjenesteytende næring</span>
            <div className="text-3xl font-serif font-bold text-ink">2 MW</div>
            <p className="text-xs text-ink-muted">
              Datasentre og næringsbygg med samlet tilført elektrisk/termisk effekt over 2 MW.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-paper border border-sand space-y-2">
            <span className="text-xs font-bold uppercase text-copper">Termiske anlegg</span>
            <div className="text-3xl font-serif font-bold text-ink">10 MW</div>
            <p className="text-xs text-ink-muted">
              Termiske kraftverk, forbrenningsanlegg og biogassanlegg med samlet tilført termisk effekt
              over 10 MW.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-paper border border-sand space-y-2">
            <span className="text-xs font-bold uppercase text-teal">Industrianlegg</span>
            <div className="text-3xl font-serif font-bold text-ink">20 MW</div>
            <p className="text-xs text-ink-muted">
              Industrianlegg med samlet tilført termisk effekt over 20 MW som produserer spillvarme.
            </p>
          </div>
        </div>
      </section>

      {/* Krav til analysens innhold (§§ 8–12) */}
      <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-sand space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-spruce">
            §§ 8–12 Krav til KNA
          </span>
          <h2 className="text-2xl font-serif font-bold text-ink mt-1">
            Hva må analysen omfatte?
          </h2>
          <p className="text-ink-muted text-sm mt-1">
            Norges vassdrags- og energidirektorat (NVE) fører tilsyn med forskriften. En fullverdig
            kost-nytteanalyse skal belyse følgende kjerneelementer:
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-paper border border-sand">
            <div className="w-8 h-8 rounded-lg bg-spruce/10 text-spruce flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-ink text-base">
                Karakterisering av overskuddsvarme (§ 8)
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Dokumentasjon av kildetemperatur, varmeeffekt (kW/MW), sesongvariasjoner og årlige
                driftstimer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-paper border border-sand">
            <div className="w-8 h-8 rounded-lg bg-spruce/10 text-spruce flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-ink text-base">
                Kartlegging av varmeavtakere i nærområdet (§ 9)
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Geografisk kartlegging av eksisterende fjernvarmenett, næringsbygg, boligområder,
                veksthus eller annen industri innenfor økonomisk overkommelig rørtraséavstand.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-paper border border-sand">
            <div className="w-8 h-8 rounded-lg bg-spruce/10 text-spruce flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-ink text-base">
                Teknisk konseptvurdering og trasé
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Vurdering av direkte varmeveksling vs. temperaturheving med industrivarmepumpe,
                rørdimensjoner, varmetap og nødvendige nettilknytninger.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-paper border border-sand">
            <div className="w-8 h-8 rounded-lg bg-spruce/10 text-spruce flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              4
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-ink text-base">
                Samfunnsøkonomisk og bedriftsøkonomisk lønnsomhet (§ 11)
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Beregning av netto nåverdi (NPV) og tilbakebetalingstid under diskonteringsrente,
                inkludert unngåtte energikostnader, unngått strømforbruk og virkninger på det lokale
                kraftnettet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unntak (§ 6) */}
      <section className="bg-sand/30 rounded-2xl p-6 sm:p-8 border border-sand space-y-4">
        <div className="flex items-center gap-2 text-ink font-serif font-bold text-xl">
          <AlertCircle className="w-5 h-5 text-copper" />
          <h3>Viktige unntak fra plikten (§ 6)</h3>
        </div>
        <p className="text-ink-muted text-sm leading-relaxed">
          Forskriftens § 6 åpner for unntak i særskilte tilfeller, blant annet dersom anlegget ligger i
          et område hvor det beviselig ikke foreligger varmebehov innenfor rimelig avstand, eller
          dersom den tilgjengelige overskuddsvarmen ikke overstiger 500 MWh per år.
        </p>
        <div className="pt-2">
          <Link
            to="/kalkulator"
            className="inline-flex items-center gap-2 text-sm font-semibold text-spruce hover:text-spruce-deep"
          >
            Test anleggets tall i kalkulatoren <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Offisielle lenker */}
      <section className="bg-surface rounded-2xl p-6 border border-sand">
        <h3 className="font-serif font-bold text-lg text-ink mb-4">Offisielle kilder og veiledere</h3>
        <div className="space-y-3 text-sm">
          <a
            href="https://lovdata.no/forskrift/2024-09-25-2263"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-paper hover:bg-sand/40 border border-sand transition-colors group"
          >
            <div>
              <span className="font-semibold text-ink group-hover:text-spruce">
                FOR-2024-09-25-2263 på Lovdata
              </span>
              <p className="text-xs text-ink-muted mt-0.5">
                Forskrift om kost-nytteanalyse for utnyttelse av overskuddsvarme
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-spruce" />
          </a>

          <a
            href="https://www.nve.no"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-paper hover:bg-sand/40 border border-sand transition-colors group"
          >
            <div>
              <span className="font-semibold text-ink group-hover:text-spruce">
                NVE (Norges vassdrags- og energidirektorat)
              </span>
              <p className="text-xs text-ink-muted mt-0.5">
                Veiledere og retningslinjer for energianalyse og overskuddsvarme
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-spruce" />
          </a>
        </div>
      </section>
    </div>
  );
}
