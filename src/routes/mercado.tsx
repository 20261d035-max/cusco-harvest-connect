import { createFileRoute } from "@tanstack/react-router";
import { Leaf, MapPin, QrCode, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { TraceabilityCard, waLink } from "@/components/TraceabilityCard";
import { useAppState } from "@/lib/app-store";
import { useI18n } from "@/lib/i18n";
import { LISTINGS, type Listing } from "@/lib/mock-data";

export const Route = createFileRoute("/mercado")({
  head: () => ({
    meta: [
      { title: "Mercado directo de productores — Qhatu Cusco" },
      {
        name: "description",
        content:
          "Compra papa nativa, maíz blanco gigante, quinua y más, directo de productores de Calca, Urubamba, Anta y Canchis.",
      },
      { property: "og:title", content: "Mercado directo de productores — Qhatu Cusco" },
      { property: "og:description", content: "Compra directo de productores cusqueños con trazabilidad QR." },
    ],
  }),
  component: MercadoPage,
});

function MercadoPage() {
  const { t, lang } = useI18n();
  const { answers, role, hydrated } = useAppState();
  const [organicOnly, setOrganicOnly] = useState(false);
  const [district, setDistrict] = useState("all");
  const [selected, setSelected] = useState<Listing | null>(null);

  const consumerPrefersOrganic = answers.consumer?.organic === "yes";

  useEffect(() => {
    if (hydrated && role === "consumer" && consumerPrefersOrganic) setOrganicOnly(true);
  }, [hydrated, role, consumerPrefersOrganic]);

  const districts = useMemo(() => [...new Set(LISTINGS.map((l) => l.district))], []);

  const filtered = LISTINGS.filter(
    (l) => (!organicOnly || l.organic) && (district === "all" || l.district === district),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">{t("market.title")}</h1>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground sm:text-base">
        {t("market.subtitle")}
      </p>

      {role === "consumer" && consumerPrefersOrganic && organicOnly && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
          <Sparkles className="h-4 w-4 shrink-0 text-terracotta" />
          Como prefieres agroecológico, activamos ese filtro por ti. Puedes quitarlo cuando quieras.
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOrganicOnly(false)}
          className={`rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
            !organicOnly ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"
          }`}
        >
          {t("market.all")}
        </button>
        <button
          onClick={() => setOrganicOnly(true)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
            organicOnly ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"
          }`}
        >
          <Leaf className="h-4 w-4" /> {t("market.onlyOrganic")}
        </button>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="ml-auto rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold outline-none focus:border-primary"
        >
          <option value="all">📍 {t("market.all")}</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => (
          <article
            key={l.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lg"
          >
            <button onClick={() => setSelected(l)} className="relative text-left">
              <img
                src={l.image}
                alt={`${l.product} — ${l.variety}`}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              {l.organic && (
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                  <Leaf className="h-3 w-3" /> {t("market.organic")}
                </span>
              )}
              <span className="absolute bottom-3 right-3 rounded-full bg-card/95 px-3 py-1.5 text-sm font-bold text-primary shadow">
                S/. {l.pricePerKg.toFixed(2)} <span className="text-xs font-medium text-muted-foreground">{t("market.perKg")}</span>
              </span>
            </button>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <h2 className="text-lg font-bold leading-snug">{l.product}</h2>
              <p className="text-sm text-muted-foreground">{l.variety}</p>
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin className="h-4 w-4 shrink-0 text-terracotta" />
                {l.community} · {l.district}
              </p>
              <p className="text-xs text-muted-foreground">
                {l.farmer} · {l.volumeKg.toLocaleString("es-PE")} kg {t("market.available")}
              </p>
              <div className="mt-auto grid gap-2 pt-3">
                <button
                  onClick={() => setSelected(l)}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-secondary"
                >
                  <QrCode className="h-4 w-4" /> {t("market.viewTrace")}
                </button>
                <a
                  href={waLink(l, lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-success px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("market.whatsapp")}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} wide>
        {selected && <TraceabilityCard listing={selected} />}
      </Modal>
    </div>
  );
}