# Varmeverdi (Forenklet utgave)

Frittstående, åpen og forenklet utgave av **Varmeverdi** for kost-nyttevurdering av overskuddsvarme etter energiloven og **FOR-2024-09-25-2263**.

Dette verktøyet kjører 100 % i nettleseren som en ren statisk applikasjon, og krever ingen backend, ingen database og ingen hemmelige API-nøkler. Den er klargjort for umiddelbar publisering på **Netlify**.

---

## Innhold og moduler

1. **Lønnsomhetskalkulator (`/kalkulator`)**
   - Beregner termisk løft og realistisk varmepumpe-COP (Lorentz/Carnot-tilnærming).
   - Årlig levert varmeenergi (MWh/år), strømforbruk og gjenvunnet spillvarme.
   - Investeringsbehov (varmepumpe + rørtrasé).
   - Netto nåverdi (NPV) og enkel tilbakebetalingstid under valgt kalkulasjonsrente.
   - Sensitivitetsanalyse på svingninger i kraftpris og varmepris.
   - Utskrifts- og PDF-vennlig visning.

2. **Kart & Avstandsmåler (`/kart`)**
   - Interaktiv kartflate over Norge basert på Kartverkets åpne topografiske fliser og Carto Positron.
   - Klikk for å sette **Kilde (A)** og **Mottaker / Fjernvarmenett (B)**.
   - Måler rettlinjet avstand i meter/kilometer.
   - Estimerer veiledende rørtrasékostnad og kan overføre tallene direkte til kalkulatoren med ett klikk.
   - Justerbar søkeradius (500 m – 5 km).

3. **Regelverk & Terskelverdier (`/regelverk`)**
   - Oversikt over forskrift om kost-nytteanalyse (FOR-2024-09-25-2263).
   - Terskelverdier for plikten (§ 5): 2 MW (datasentre/bygg), 10 MW (termiske anlegg), 20 MW (industri).
   - Lovmessige krav til innhold og unntaksbestemmelser (§ 6).
   - Direkte kildehenvisninger til Lovdata og NVE.

---

## Teknologi

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React
- **Kart:** MapLibre GL med åpne WMTS-fliser fra Kartverket
- **Hosting:** Klargjort for Netlify (inkluderer `netlify.toml` med automatiske SPA-omdirigeringer)

---

## Lokal kjøring

```bash
# 1. Klon repoet (hvis du ikke allerede har det)
git clone https://github.com/usmandar2021/varmeverdi-mini.git
cd varmeverdi-mini

# 2. Installer avhengigheter
npm install

# 3. Start lokal utviklingsserver
npm run dev
```

Applikasjonen åpnes på `http://localhost:3000`.

---

## Publisering på Netlify

### Metode A: Koble direkte til GitHub (Anbefalt)
1. Gå til [Netlify Dashboard](https://app.netlify.com).
2. Klikk **Add new site** → **Import an existing project**.
3. Velg **GitHub** og velg repositoryet `usmandar2021/varmeverdi-mini`.
4. Netlify leser automatisk `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Klikk **Deploy site**. Siden er på lufta i løpet av 30 sekunder!

### Metode B: Manuell opplasting (Drag & Drop)
```bash
npm run build
```
Dra deretter den genererte `dist`-mappen rett inn i [Netlify Drop](https://app.netlify.com/drop).
