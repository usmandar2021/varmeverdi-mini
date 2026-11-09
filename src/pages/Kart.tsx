import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { MapPin, Navigation, ArrowRight, Trash2, Layers, Search } from 'lucide-react';
import { useNavigate } from 'react-router';

// Kartlagkilder (åpne uten API-nøkler)
const KART_STILER = {
  kartverket: {
    navn: 'Kartverket Topo',
    attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
    tiles: ['https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png'],
  },
  carto: {
    navn: 'Carto Lys (Gråtone)',
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
    tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
  },
};

// Hurtignavigering til norske byer / industrisentre
const HURTIG_BYER = [
  { navn: 'Oslo', coords: [10.7522, 59.9139] },
  { navn: 'Bergen', coords: [5.3221, 60.3913] },
  { navn: 'Trondheim', coords: [10.3951, 63.4305] },
  { navn: 'Stavanger', coords: [5.7331, 58.9699] },
  { navn: 'Kristiansand', coords: [8.0182, 58.1599] },
  { navn: 'Tromsø', coords: [18.9553, 69.6492] },
  { navn: 'Porsgrunn / Grenland', coords: [9.6561, 59.1405] },
  { navn: 'Mo i Rana', coords: [14.1364, 66.3138] },
];

// Haversine-avstandsberegning (i meter)
function beregnAvstandM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Jordens radius i meter
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Generer sirkel-polygon (GeoJSON) for radiusvisning
function lagSirkelGeoJson(center: [number, number], radiusMeter: number, punkter = 64) {
  const coords: [number, number][] = [];
  const km = radiusMeter / 1000;
  const lat = (center[1] * Math.PI) / 180;
  const lon = (center[0] * Math.PI) / 180;
  const d = km / 6371; // Vinkelavstand i radianer

  for (let x = 0; x <= punkter; x++) {
    const brng = (x * 2 * Math.PI) / punkter;
    const pLat = Math.asin(
      Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(brng)
    );
    const pLon =
      lon +
      Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat),
        Math.cos(d) - Math.sin(lat) * Math.sin(pLat)
      );
    coords.push([(pLon * 180) / Math.PI, (pLat * 180) / Math.PI]);
  }

  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [coords],
    },
  };
}

export default function Kart() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const kildeMarkerRef = useRef<maplibregl.Marker | null>(null);
  const mottakerMarkerRef = useRef<maplibregl.Marker | null>(null);

  const navigate = useNavigate();

  // State
  const [aktivStil, setAktivStil] = useState<'kartverket' | 'carto'>('kartverket');
  const [kilde, setKilde] = useState<[number, number] | null>(null); // [lon, lat]
  const [mottaker, setMottaker] = useState<[number, number] | null>(null); // [lon, lat]
  const [radiusMeter, setRadiusMeter] = useState<number>(2000); // 2 km
  const [antattMeterKost, setAntattMeterKost] = useState<number>(4000); // kr/m

  // Beregnet avstand
  const avstandM =
    kilde && mottaker ? beregnAvstandM(kilde[1], kilde[0], mottaker[1], mottaker[0]) : null;

  const estimertRorKost = avstandM ? avstandM * antattMeterKost : null;

  // Initialiser kartet
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const styleObj: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        base_tiles: {
          type: 'raster',
          tiles: KART_STILER[aktivStil].tiles,
          tileSize: 256,
          attribution: KART_STILER[aktivStil].attribution,
        },
      },
      layers: [
        {
          id: 'base_tiles_layer',
          type: 'raster',
          source: 'base_tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleObj,
      center: [10.75, 59.91], // Oslo
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      // Legg til kilde for radius og linje
      map.addSource('radius-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Lag for fyll i sirkel
      map.addLayer({
        id: 'radius-fill',
        type: 'fill',
        source: 'radius-source',
        paint: {
          'fill-color': '#1C5748',
          'fill-opacity': 0.12,
        },
      });

      // Lag for sirkel-omriss
      map.addLayer({
        id: 'radius-line',
        type: 'line',
        source: 'radius-source',
        paint: {
          'line-color': '#1C5748',
          'line-width': 2,
          'line-dasharray': [3, 2],
        },
      });

      // Kilde og lag for trasélinje mellom kilde og mottaker
      map.addSource('trase-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'trase-line',
        type: 'line',
        source: 'trase-source',
        paint: {
          'line-color': '#BC5A28',
          'line-width': 4,
        },
      });
    });

    // Klikk i kartet for å sette kilde eller mottaker
    map.on('click', (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setKilde((prevKilde) => {
        if (!prevKilde) {
          return coords;
        } else {
          // Hvis kilde allerede er satt, sett eller flytt mottaker
          setMottaker(coords);
          return prevKilde;
        }
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Oppdater stil ved bytte
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('base_tiles') as maplibregl.RasterTileSource;
    if (source && source.setTiles) {
      source.setTiles(KART_STILER[aktivStil].tiles);
    }
  }, [aktivStil]);

  // Oppdater Kilde-markør og radius
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!kilde) {
      if (kildeMarkerRef.current) {
        kildeMarkerRef.current.remove();
        kildeMarkerRef.current = null;
      }
      const radiusSource = map.getSource('radius-source') as maplibregl.GeoJSONSource;
      if (radiusSource) {
        radiusSource.setData({ type: 'FeatureCollection', features: [] });
      }
      return;
    }

    if (!kildeMarkerRef.current) {
      const el = document.createElement('div');
      el.className =
        'w-8 h-8 rounded-full bg-spruce text-surface flex items-center justify-center font-bold text-xs shadow-lg border-2 border-surface';
      el.innerText = 'A';
      kildeMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(kilde)
        .addTo(map);
    } else {
      kildeMarkerRef.current.setLngLat(kilde);
    }

    // Oppdater radius i GeoJSON
    const radiusSource = map.getSource('radius-source') as maplibregl.GeoJSONSource;
    if (radiusSource) {
      const circleFeature = lagSirkelGeoJson(kilde, radiusMeter);
      radiusSource.setData({
        type: 'FeatureCollection',
        features: [circleFeature],
      });
    }
  }, [kilde, radiusMeter]);

  // Oppdater Mottaker-markør og trasélinje
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!mottaker) {
      if (mottakerMarkerRef.current) {
        mottakerMarkerRef.current.remove();
        mottakerMarkerRef.current = null;
      }
      const traseSource = map.getSource('trase-source') as maplibregl.GeoJSONSource;
      if (traseSource) {
        traseSource.setData({ type: 'FeatureCollection', features: [] });
      }
      return;
    }

    if (!mottakerMarkerRef.current) {
      const el = document.createElement('div');
      el.className =
        'w-8 h-8 rounded-full bg-copper text-surface flex items-center justify-center font-bold text-xs shadow-lg border-2 border-surface';
      el.innerText = 'B';
      mottakerMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(mottaker)
        .addTo(map);
    } else {
      mottakerMarkerRef.current.setLngLat(mottaker);
    }

    // Tegn linje hvis begge er satt
    if (kilde) {
      const traseSource = map.getSource('trase-source') as maplibregl.GeoJSONSource;
      if (traseSource) {
        traseSource.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [kilde, mottaker],
              },
            },
          ],
        });
      }
    }
  }, [kilde, mottaker]);

  const nullstillMarkører = () => {
    setKilde(null);
    setMottaker(null);
  };

  const flyttTil = (coords: number[]) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [coords[0], coords[1]],
      zoom: 12,
      essential: true,
    });
  };

  const overforTilKalkulator = () => {
    if (avstandM) {
      navigate(`/kalkulator?rorLengde=${avstandM}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Topplinje */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-spruce/10 text-spruce text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            Kart & Avstandsmåler
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink">Forenklet kartvisning</h1>
          <p className="text-ink-muted text-sm mt-0.5">
            Klikk i kartet for å markere varmekilde (A) og potensiell mottaker (B).
          </p>
        </div>

        {/* Kartlagbytte og nullstill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg bg-surface border border-sand p-1 text-xs">
            <button
              onClick={() => setAktivStil('kartverket')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                aktivStil === 'kartverket'
                  ? 'bg-spruce text-surface'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Kartverket
            </button>
            <button
              onClick={() => setAktivStil('carto')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                aktivStil === 'carto'
                  ? 'bg-spruce text-surface'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Gråtone (Carto)
            </button>
          </div>

          {(kilde || mottaker) && (
            <button
              onClick={nullstillMarkører}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-sand/40 border border-sand text-ink-muted hover:text-ink text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Nullstill punkter
            </button>
          )}
        </div>
      </div>

      {/* Hurtigvalg byer */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-ink-muted font-medium whitespace-nowrap">Hurtigvelger:</span>
        {HURTIG_BYER.map((b) => (
          <button
            key={b.navn}
            onClick={() => flyttTil(b.coords)}
            className="px-2.5 py-1 rounded-md bg-surface hover:bg-sand/40 border border-sand text-ink whitespace-nowrap transition-colors"
          >
            {b.navn}
          </button>
        ))}
      </div>

      {/* Kartcontainer & infopanel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kartflate (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-sand overflow-hidden relative shadow-sm min-h-[520px] h-[65vh]">
          <div ref={mapContainer} className="w-full h-full" />

          {/* Instruksjonsmerke øverst til venstre over kartet */}
          <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-sand text-xs shadow-md pointer-events-none space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-spruce" />
              <span>
                Punkt A:{' '}
                <strong>
                  {kilde ? `${kilde[1].toFixed(4)}°N, ${kilde[0].toFixed(4)}°Ø` : 'Klikk i kartet'}
                </strong>
              </span>
            </div>
            {kilde && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-copper" />
                <span>
                  Punkt B:{' '}
                  <strong>
                    {mottaker
                      ? `${mottaker[1].toFixed(4)}°N, ${mottaker[0].toFixed(4)}°Ø`
                      : 'Klikk neste punkt for mottaker'}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Kontrollpanel og måleresultater (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Resultatkort trasé */}
          <div className="bg-surface rounded-2xl p-6 border border-sand shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
              <Navigation className="w-5 h-5 text-copper" />
              Trasé & Avstandsmåling
            </h3>

            {avstandM !== null ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-paper border border-sand">
                  <span className="text-xs font-semibold uppercase text-ink-muted">
                    Beregnet avstand (fugleperspektiv)
                  </span>
                  <div className="text-3xl font-serif font-bold text-spruce mt-1">
                    {avstandM >= 1000 ? `${(avstandM / 1000).toFixed(2)} km` : `${avstandM} meter`}
                  </div>
                  <span className="text-xs text-ink-muted">
                    Rett linje fra kilde (A) til mottaker (B)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-paper border border-sand space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-ink-muted font-medium">Antatt kostnad per meter grøft:</span>
                    <span className="font-semibold text-ink">{antattMeterKost} kr/m</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="500"
                    value={antattMeterKost}
                    onChange={(e) => setAntattMeterKost(Number(e.target.value))}
                    className="w-full accent-spruce"
                  />
                  <div className="pt-2 border-t border-sand/70 flex justify-between items-center">
                    <span className="text-xs font-semibold text-ink-muted uppercase">
                      Estimert rørinvestering:
                    </span>
                    <span className="font-serif font-bold text-ink text-base">
                      {estimertRorKost?.toLocaleString('nb-NO')} kr
                    </span>
                  </div>
                </div>

                <button
                  onClick={overforTilKalkulator}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-copper hover:bg-copper-hover text-surface text-sm font-semibold shadow-sm transition-all"
                >
                  Overfør rørkostnad til kalkulatoren
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-sand/30 border border-sand/60 text-center space-y-2">
                <MapPin className="w-8 h-8 text-spruce mx-auto opacity-70" />
                <p className="text-sm font-medium text-ink">Ingen trasé tegnet ennå</p>
                <p className="text-xs text-ink-muted leading-relaxed">
                  1. Klikk i kartet for å sette <strong>Kilde (A)</strong>.
                  <br />
                  2. Klikk på et annet punkt for å sette <strong>Mottaker (B)</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Søkeradius kontroll */}
          <div className="bg-surface rounded-2xl p-6 border border-sand space-y-4">
            <h4 className="font-serif font-bold text-base text-ink flex items-center justify-between">
              <span>Søkeradius rundt kilde</span>
              <span className="text-xs font-sans font-semibold text-spruce">
                {(radiusMeter / 1000).toFixed(1)} km
              </span>
            </h4>
            <input
              type="range"
              min="500"
              max="5000"
              step="250"
              value={radiusMeter}
              onChange={(e) => setRadiusMeter(Number(e.target.value))}
              className="w-full accent-spruce"
            />
            <div className="flex justify-between text-[11px] text-ink-muted">
              <span>500 m</span>
              <span>2 km (standard)</span>
              <span>5 km</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Radius-sirkelen indikerer det typiske nærområdet hvor utnyttelse av overskuddsvarme til
              bygg eller industriformål er mest aktuelt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
