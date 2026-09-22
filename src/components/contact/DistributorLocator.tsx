import { useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { BadgeCheckIcon, MapPinIcon, MessageCircleIcon, PhoneIcon, SearchIcon } from 'lucide-react';

const MapContainerComponent = MapContainer as unknown as React.ComponentType<any>;
const TileLayerComponent = TileLayer as unknown as React.ComponentType<any>;
const CircleMarkerComponent = CircleMarker as unknown as React.ComponentType<any>;
import { distributors } from '../../data/distributors';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Badge } from '../shared/Badge';
import { EmptyState } from '../shared/EmptyState';
import { PlaceholderNotice } from '../shared/PlaceholderNotice';

export function DistributorLocator() {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');

  const govOptions = useMemo(
    () => Array.from(new Map(distributors.map((d) => [d.governorate.en, d.governorate])).values()),
    []
  );
  const cityOptions = useMemo(
    () =>
    Array.from(
      new Map(
        distributors.
        filter((d) => !governorate || d.governorate.en === governorate).
        map((d) => [d.city.en, d.city])
      ).values()
    ),
    [governorate]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return distributors.filter((d) => {
      const matchesQuery =
      !q ||
      t(d.name).toLowerCase().includes(q) ||
      t(d.address).toLowerCase().includes(q) ||
      t(d.city).toLowerCase().includes(q);
      const matchesGov = !governorate || d.governorate.en === governorate;
      const matchesCity = !city || d.city.en === city;
      return matchesQuery && matchesGov && matchesCity;
    });
  }, [query, governorate, city, t]);

  function reset() {
    setQuery('');
    setGovernorate('');
    setCity('');
  }

  return (
    <div className="flex flex-col gap-6">
      <PlaceholderNotice title={t(ui.common.placeholderTag)}>{t(ui.distributors.notice)}</PlaceholderNotice>

      <div className="grid gap-3 rounded-card border border-slate-100 bg-white p-4 shadow-card md:grid-cols-3">
        <div className="relative md:col-span-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-4 rtl:right-4" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(ui.distributors.searchPlaceholder)}
            aria-label={t(ui.common.search)}
            className="focus-ring w-full rounded-xl border border-slate-200 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-400 focus:outline-none ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4" />
          
        </div>
        <select
          value={governorate}
          onChange={(e) => {
            setGovernorate(e.target.value);
            setCity('');
          }}
          aria-label={t(ui.distributors.governorate)}
          className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink focus:border-brand-400 focus:outline-none">
          
          <option value="">{t(ui.distributors.governorate)}</option>
          {govOptions.map((gov) =>
          <option key={gov.en} value={gov.en}>
              {t(gov)}
            </option>
          )}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label={t(ui.distributors.city)}
          className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink focus:border-brand-400 focus:outline-none">
          
          <option value="">{t(ui.distributors.city)}</option>
          {cityOptions.map((c) =>
          <option key={c.en} value={c.en}>
              {t(c)}
            </option>
          )}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ?
          <EmptyState
            title={t(ui.common.noResultsTitle)}
            body={t(ui.common.noResultsBody)}
            actionLabel={t(ui.common.reset)}
            onAction={reset} /> :


          filtered.map((distributor) =>
          <article key={distributor.id} className="rounded-card border border-slate-100 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold text-ink">{t(distributor.name)}</h3>
                  {distributor.verified ?
              <Badge tone="green" icon={<BadgeCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />}>
                      {t(ui.distributors.verified)}
                    </Badge> :

              <Badge tone="gold">{t(ui.common.placeholderTag)}</Badge>
              }
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                  <MapPinIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
                  {t(distributor.governorate)} — {t(distributor.city)} — {t(distributor.address)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-pill border border-slate-200 px-4 py-2 text-xs font-bold text-ink-muted">
                    <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                    {t(ui.distributors.call)}: {distributor.phone}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-pill border border-slate-200 px-4 py-2 text-xs font-bold text-ink-muted">
                    <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
                    {t(ui.distributors.whatsapp)}: {distributor.whatsapp}
                  </span>
                </div>
              </article>
          )
          }
        </div>

        <div className="overflow-hidden rounded-card border border-slate-100 bg-white shadow-card">
          <h3 className="border-b border-slate-100 px-5 py-4 text-sm font-extrabold text-ink">{t(ui.distributors.mapTitle)}</h3>
          <div className="h-[420px] w-full">
            <MapContainerComponent center={[29.5, 30.8]} zoom={6} scrollWheelZoom={false} className="h-full w-full">
              <TileLayerComponent
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {filtered.map((distributor) =>
              <CircleMarkerComponent
                key={distributor.id}
                center={distributor.coords}
                radius={9}
                pathOptions={{ color: '#1B5E20', fillColor: '#4CAF50', fillOpacity: 0.85, weight: 2 }}>
                
                  <Popup>
                    <span className="text-sm font-bold">{t(distributor.name)}</span>
                    <br />
                    <span className="text-xs">{t(distributor.city)}</span>
                  </Popup>
                </CircleMarkerComponent>
              )}
            </MapContainerComponent>
          </div>
        </div>
      </div>
    </div>);

}