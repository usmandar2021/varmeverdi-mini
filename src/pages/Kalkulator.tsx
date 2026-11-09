import { useState, useMemo } from 'react';
import {
  Calculator,
  RotateCcw,
  Printer,
  TrendingUp,
  Zap,
  Flame,
  ArrowRight,
  Info,
  DollarSign,
  Clock,
  Layers,
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router';

// Forhåndsdefinerte typiske case
const FORHÅNDSOPPSETT = [
  {
    navn: 'Datasenter / Serverkjøling',
    effektKw: 1500,
    kildeTemp: 32,
    leveringTemp: 70,
    timer: 8000,
    spesifikkInvestering: 4200,
    rorLengdeM: 600,
    rorKostPerM: 4000,
    varmePris: 0.75,
    stromPris: 0.85,
  },
  {
    navn: 'Næringsmiddel / Kjøleanlegg',
    effektKw: 600,
    kildeTemp: 28,
    leveringTemp: 65,
    timer: 6000,
    spesifikkInvestering: 4800,
    rorLengdeM: 300,
    rorKostPerM: 3800,
    varmePris: 0.80,
    stromPris: 0.90,
  },
  {
    navn: 'Industrielt kjølevann (lavtemp)',
    effektKw: 3000,
    kildeTemp: 45,
    leveringTemp: 75,
    timer: 7500,
    spesifikkInvestering: 3800,
    rorLengdeM: 1200,
    rorKostPerM: 4200,
    varmePris: 0.70,
    stromPris: 0.80,
  },
];

export default function Kalkulator() {
  const [searchParams] = useSearchParams();

  // Hent eventuelle parametere fra kartet
  const initialRorLengde = Number(searchParams.get('rorLengde')) || 400;

  // Input states
  const [effektKw, setEffektKw] = useState<number>(1000);
  const [kildeTemp, setKildeTemp] = useState<number>(35);
  const [leveringTemp, setLeveringTemp] = useState<number>(70);
  const [driftstimer, setDriftstimer] = useState<number>(6500);

  // Investeringer
  const [spesifikkInvestering, setSpesifikkInvestering] = useState<number>(4500); // kr/kW levert
  const [rorLengdeM, setRorLengdeM] = useState<number>(initialRorLengde);
  const [rorKostPerM, setRorKostPerM] = useState<number>(4000); // kr/meter

  // Energipriser og kalkulasjon
  const [varmePris, setVarmePris] = useState<number>(0.75); // kr/kWh
  const [stromPris, setStromPris] = useState<number>(0.85); // kr/kWh inkl nettleie
  const [kalkulasjonsrente, setKalkulasjonsrente] = useState<number>(5.0); // %
  const [levetid, setLevetid] = useState<number>(15); // år

  // Beregninger
  const beregninger = useMemo(() => {
    const isDirekteVeksling = kildeTemp >= leveringTemp;
    
    // Beregn COP
    let cop = 0;
    if (isDirekteVeksling) {
      cop = 999; // Tilnærmet uendelig (kun pumpeeffekt)
    } else {
      const tHotK = leveringTemp + 273.15;
      const deltaT = Math.max(1, leveringTemp - kildeTemp);
      const carnotCop = tHotK / deltaT;
      // Eksergetisk virkningsgrad 0.50 for industriell varmepumpe
      cop = Math.min(9.0, Math.max(2.0, Number((0.50 * carnotCop).toFixed(2))));
    }

    // Energimengder
    const arligLevertVarmeMwh = (effektKw * driftstimer) / 1000;
    const arligStromforbrukMwh = isDirekteVeksling ? 0 : arligLevertVarmeMwh / cop;
    const arligGjenvunnetSpillvarmeMwh = arligLevertVarmeMwh - arligStromforbrukMwh;

    // Investeringer (CAPEX)
    const vpInvestering = effektKw * spesifikkInvestering;
    const rorInvestering = rorLengdeM * rorKostPerM;
    const totalInvestering = vpInvestering + rorInvestering;

    // Årlige driftskostnader og inntekter (OPEX)
    const arligVarmeInntekt = arligLevertVarmeMwh * 1000 * varmePris;
    const arligStromKostnad = arligStromforbrukMwh * 1000 * stromPris;
    const arligVedlikehold = totalInvestering * 0.015; // 1.5% O&M
    const arligNettoGevinst = arligVarmeInntekt - arligStromKostnad - arligVedlikehold;

    // Nåverdi (NPV)
    const r = kalkulasjonsrente / 100;
    const naverdiFaktor = r > 0 ? (1 - Math.pow(1 + r, -levetid)) / r : levetid;
    const naverdiKontantstrommer = arligNettoGevinst * naverdiFaktor;
    const npv = naverdiKontantstrommer - totalInvestering;

    // Enkel tilbakebetalingstid
    const tilbakebetalingstid = arligNettoGevinst > 0 ? totalInvestering / arligNettoGevinst : 99;

    return {
      isDirekteVeksling,
      cop: isDirekteVeksling ? 'Direkte veksling' : cop.toFixed(2),
      copNum: cop,
      arligLevertVarmeMwh: Math.round(arligLevertVarmeMwh),
      arligStromforbrukMwh: Math.round(arligStromforbrukMwh),
      arligGjenvunnetSpillvarmeMwh: Math.round(arligGjenvunnetSpillvarmeMwh),
      vpInvestering: Math.round(vpInvestering),
      rorInvestering: Math.round(rorInvestering),
      totalInvestering: Math.round(totalInvestering),
      arligVarmeInntekt: Math.round(arligVarmeInntekt),
      arligStromKostnad: Math.round(arligStromKostnad),
      arligVedlikehold: Math.round(arligVedlikehold),
      arligNettoGevinst: Math.round(arligNettoGevinst),
      tilbakebetalingstid: Number(tilbakebetalingstid.toFixed(1)),
      npv: Math.round(npv),
    };
  }, [
    effektKw,
    kildeTemp,
    leveringTemp,
    driftstimer,
    spesifikkInvestering,
    rorLengdeM,
    rorKostPerM,
    varmePris,
    stromPris,
    kalkulasjonsrente,
    levetid,
  ]);

  const loadPreset = (preset: (typeof FORHÅNDSOPPSETT)[0]) => {
    setEffektKw(preset.effektKw);
    setKildeTemp(preset.kildeTemp);
    setLeveringTemp(preset.leveringTemp);
    setDriftstimer(preset.timer);
    setSpesifikkInvestering(preset.spesifikkInvestering);
    setRorLengdeM(preset.rorLengdeM);
    setRorKostPerM(preset.rorKostPerM);
    setVarmePris(preset.varmePris);
    setStromPris(preset.stromPris);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-spruce/10 text-spruce text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Lønnsomhetskalkulator
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink">
            Kost-nytte for overskuddsvarme
          </h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Regn ut nødvendig varmepumpeløft (COP), årlig energileveranse, investeringsbehov og
            prosjektets nåverdi (NPV) og tilbakebetalingstid.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface hover:bg-sand/40 border border-sand text-ink text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4 text-spruce" />
            Skriv ut / PDF
          </button>
        </div>
      </div>

      {/* Forhåndsvalg / eksempler */}
      <div className="bg-surface rounded-xl p-4 border border-sand flex flex-wrap items-center gap-3 print:hidden">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Hurtigoppsett for typiske anlegg:
        </span>
        {FORHÅNDSOPPSETT.map((p) => (
          <button
            key={p.navn}
            onClick={() => loadPreset(p)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sand/40 hover:bg-spruce/10 hover:text-spruce transition-colors"
          >
            {p.navn}
          </button>
        ))}
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Venstre kolonne: Inndata (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Seksjon 1: Termiske parametere */}
          <div className="bg-surface rounded-2xl p-6 border border-sand space-y-5">
            <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
              <Flame className="w-5 h-5 text-copper" />
              1. Spillvarme & temperaturer
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Levert termisk effekt (kW)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="50000"
                    step="50"
                    value={effektKw}
                    onChange={(e) => setEffektKw(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">kW</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  = {(effektKw / 1000).toFixed(2)} MW varmeeffekt
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Årlige driftstimer (timer/år)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="500"
                    max="8760"
                    step="100"
                    value={driftstimer}
                    onChange={(e) => setDriftstimer(Math.max(100, Math.min(8760, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">timer</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Maks 8 760 t/år (industri: typisk 6 000–8 000)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Kildetemperatur (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="150"
                    value={kildeTemp}
                    onChange={(e) => setKildeTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">°C</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Spillvarmens temperatur ved kilden
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Ønsket leveringstemperatur (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max="120"
                    value={leveringTemp}
                    onChange={(e) => setLeveringTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">°C</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Turtemperatur til mottaker / fjernnett
                </p>
              </div>
            </div>

            {/* COP status banner */}
            <div className="p-3 rounded-xl bg-sand/30 border border-sand/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-copper" />
                <span className="text-xs font-semibold text-ink">Beregnet varmepumpe-COP:</span>
              </div>
              <span className="font-serif font-bold text-spruce text-sm">
                {beregninger.cop}
                {!beregninger.isDirekteVeksling && (
                  <span className="text-[11px] font-normal text-ink-muted ml-1.5">
                    (Temperaturløft: {Math.max(0, leveringTemp - kildeTemp)} °C)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Seksjon 2: Investeringer (CAPEX) */}
          <div className="bg-surface rounded-2xl p-6 border border-sand space-y-5">
            <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal" />
              2. Investering (CAPEX)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Varmepumpe / Veksler (kr/kW)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="500"
                    max="15000"
                    step="100"
                    value={spesifikkInvestering}
                    onChange={(e) => setSpesifikkInvestering(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">kr/kW</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  VP-kost: {beregninger.vpInvestering.toLocaleString('nb-NO')} kr
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-ink-muted uppercase">
                    Rørtrasé avstand (meter)
                  </label>
                  <Link
                    to="/kart"
                    className="text-[11px] text-spruce hover:underline inline-flex items-center gap-0.5 print:hidden"
                  >
                    Mål i kart <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    step="50"
                    value={rorLengdeM}
                    onChange={(e) => setRorLengdeM(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">m</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Grøft og fjernvarmerør til mottaker
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Rørkostnad per meter grøft (kr/m)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    max="15000"
                    step="200"
                    value={rorKostPerM}
                    onChange={(e) => setRorKostPerM(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">kr/m</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Rørkost: {beregninger.rorInvestering.toLocaleString('nb-NO')} kr
                </p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="p-3 rounded-xl bg-sand/30 border border-sand/60">
                  <span className="block text-xs text-ink-muted">Total anleggsinvestering:</span>
                  <span className="font-serif font-bold text-ink text-base">
                    {beregninger.totalInvestering.toLocaleString('nb-NO')} kr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seksjon 3: Driftsøkonomi (Energipriser & rente) */}
          <div className="bg-surface rounded-2xl p-6 border border-sand space-y-5">
            <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-spruce" />
              3. Energipriser & kalkyleregler
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Oppnådd varmepris (kr/kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    value={varmePris}
                    onChange={(e) => setVarmePris(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">kr/kWh</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Inntektsverdi for levert varme
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Strømpris drift inkl. nett (kr/kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    value={stromPris}
                    onChange={(e) => setStromPris(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">kr/kWh</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Elektrisk kraft til kompressorer
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Kalkulasjonsrente (% p.a.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1.0"
                    max="15.0"
                    step="0.5"
                    value={kalkulasjonsrente}
                    onChange={(e) => setKalkulasjonsrente(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">%</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Diskonteringsrente for nåverdi
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                  Analyseperiode / Levetid (år)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="30"
                    step="1"
                    value={levetid}
                    onChange={(e) => setLevetid(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-sand bg-paper text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-spruce"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-muted">år</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Typisk teknisk levetid: 15–20 år
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Høyre kolonne: Resultatkort & Nøkkeltall (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hovedresultat: NPV & Payback */}
          <div className="bg-surface rounded-2xl p-6 sm:p-7 border-2 border-spruce/30 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-spruce">
                Hovedresultat
              </span>
              <h3 className="text-2xl font-serif font-bold text-ink mt-1">Prosjektøkonomi</h3>
            </div>

            {/* Nøkkeltall 1: NPV */}
            <div className="p-4 rounded-xl bg-paper border border-sand">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-muted uppercase">
                  Netto Nåverdi (NPV)
                </span>
                <span className="text-xs font-medium text-ink-muted">
                  over {levetid} år ({kalkulasjonsrente} %)
                </span>
              </div>
              <div
                className={`text-3xl font-serif font-bold mt-2 ${
                  beregninger.npv >= 0 ? 'text-spruce' : 'text-copper'
                }`}
              >
                {beregninger.npv.toLocaleString('nb-NO')} kr
              </div>
              <p className="text-xs text-ink-muted mt-1">
                {beregninger.npv >= 0
                  ? '✓ Prosjektet er samfunns- og bedriftsøkonomisk lønnsomt med valgt kalkulasjonsrente.'
                  : '⚠ Negativ nåverdi. Krever høyere varmepris, lavere rørkostnad eller investeringsstøtte.'}
              </p>
            </div>

            {/* Nøkkeltall 2: Tilbakebetalingstid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-paper border border-sand">
                <span className="text-xs font-semibold text-ink-muted uppercase">
                  Tilbakebetalingstid
                </span>
                <div className="text-2xl font-serif font-bold text-ink mt-2">
                  {beregninger.tilbakebetalingstid > 50
                    ? '> 50 år'
                    : `${beregninger.tilbakebetalingstid} år`}
                </div>
                <span className="text-[11px] text-ink-muted">Enkel (simple payback)</span>
              </div>

              <div className="p-4 rounded-xl bg-paper border border-sand">
                <span className="text-xs font-semibold text-ink-muted uppercase">
                  Netto gevinst / år
                </span>
                <div className="text-2xl font-serif font-bold text-ink mt-2">
                  {beregninger.arligNettoGevinst.toLocaleString('nb-NO')} kr
                </div>
                <span className="text-[11px] text-ink-muted">Etter strøm & O&M</span>
              </div>
            </div>

            {/* Energibalanse sammendrag */}
            <div className="border-t border-sand/80 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>Årlig levert varme:</span>
                <span className="font-semibold text-ink">
                  {beregninger.arligLevertVarmeMwh.toLocaleString('nb-NO')} MWh/år
                </span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Gjenvunnet overskuddsvarme:</span>
                <span className="font-semibold text-spruce">
                  {beregninger.arligGjenvunnetSpillvarmeMwh.toLocaleString('nb-NO')} MWh/år
                </span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Strømbehov varmepumpe:</span>
                <span className="font-semibold text-ink">
                  {beregninger.arligStromforbrukMwh.toLocaleString('nb-NO')} MWh/år
                </span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Total investering (CAPEX):</span>
                <span className="font-semibold text-ink">
                  {beregninger.totalInvestering.toLocaleString('nb-NO')} kr
                </span>
              </div>
            </div>

            {/* Kildehenvisning */}
            <div className="text-[11px] text-ink-muted/80 bg-sand/20 p-3 rounded-lg border border-sand/50">
              Metode: Carnot-eksergisk varmepumpemodell med diskontert kontantstrømanalyse i tråd med
              veiledende prinsipper for kost-nyttevurdering (FOR-2024-09-25-2263).
            </div>
          </div>

          {/* Sensitivitet / Hurtigoversikt */}
          <div className="bg-surface rounded-2xl p-6 border border-sand space-y-4">
            <h4 className="text-sm font-serif font-bold text-ink flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-spruce" />
              Sensitivitet: Hva skjer hvis varmeprisen endres?
            </h4>
            <div className="space-y-2 text-xs">
              {[-0.15, 0, 0.15].map((delta) => {
                const testPrice = Math.max(0.1, Number((varmePris + delta).toFixed(2)));
                const testInntekt = beregninger.arligLevertVarmeMwh * 1000 * testPrice;
                const testNetto = testInntekt - beregninger.arligStromKostnad - beregninger.arligVedlikehold;
                const r = kalkulasjonsrente / 100;
                const naverdiFaktor = r > 0 ? (1 - Math.pow(1 + r, -levetid)) / r : levetid;
                const testNpv = Math.round(testNetto * naverdiFaktor - beregninger.totalInvestering);
                return (
                  <div
                    key={delta}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-paper border border-sand/60"
                  >
                    <span>
                      Varmepris: <strong>{testPrice.toFixed(2)} kr/kWh</strong> ({delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)})
                    </span>
                    <span
                      className={`font-semibold ${testNpv >= 0 ? 'text-spruce' : 'text-copper'}`}
                    >
                      NPV: {testNpv.toLocaleString('nb-NO')} kr
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
