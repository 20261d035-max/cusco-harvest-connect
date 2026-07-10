import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Clock, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Sparkline } from "@/components/Sparkline";
import { useAppState } from "@/lib/app-store";
import { useI18n } from "@/lib/i18n";
import { MARKETS, PRICE_ROWS } from "@/lib/mock-data";

export const Route = createFileRoute("/precios")({
  head: () => ({
    meta: [
      { title: "Precios de mercado Cusco — Qhatu" },
      {
        name: "description",
        content:
          "Precios de referencia por kilo en Huancaro, San Pedro y Vinocanchón: papa nativa, maíz blanco gigante, quinua y más.",
      },
      { property: "og:title", content: "Precios de mercado Cusco — Qhatu" },
      { property: "og:description", content: "Precios de referencia en los mercados de Cusco." },
    ],
  }),
  component: PreciosPage,
});

function PreciosPage() {
  const { t } = useI18n();
  const { answers, role } = useAppState();
  const [market, setMarket] = useState<string>("huancaro");
  const [calcProduct, setCalcProduct] = useState(PRICE_ROWS[0].id);
  const [kg, setKg] = useState(100);
  const [cost, setCost] = useState(1.5);

  const farmerCrop = answers.farmer?.crops;

  const rows = useMemo(() => {
    if (!farmerCrop) return PRICE_ROWS;
    return [...PRICE_ROWS].sort((a, b) =>
      a.id === farmerCrop ? -1 : b.id === farmerCrop ? 1 : 0,
    );
  }, [farmerCrop]);

  const selected = PRICE_ROWS.find((r) => r.id === calcProduct)!;
  const price = selected.prices[market] ?? selected.prices.huancaro;
  const revenue = kg * price;
  const profit = revenue - kg * cost;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">{t("prices.title")}</h1>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground sm:text-base">
        {t("prices.subtitle")}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-terracotta">
        <Clock className="h-3.5 w-3.5" /> {t("prices.updated")}
      </p>

      {role === "farmer" && farmerCrop && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
          <Sparkles className="h-4 w-4 shrink-0 text-terracotta" />
          Ordenamos la lista según lo que cultivas. ¡Tu producto va primero!
        </div>
      )}

      {/* Market tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {MARKETS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMarket(m.id)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
              market === m.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {m.name.replace("Mercado de Productores de ", "").replace("Mercado Central de ", "").replace("Mercado ", "")}
          </button>
        ))}
      </div>

      {/* Price list */}
      <div className="mt-4 space-y-3">
        {rows.map((r) => {
          const up = r.trendPct >= 0;
          const isMine = r.id === farmerCrop;
          return (
            <div
              key={r.id}
              className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[minmax(0,1.4fr)_auto_auto_auto] sm:gap-6 ${
                isMine ? "border-terracotta/60 ring-1 ring-terracotta/30" : "border-border"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-muted text-xl">
                  {r.emoji}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold">{r.name}</p>
                  {isMine && (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-terracotta">
                      Tu cultivo
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right sm:text-left">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("prices.avgPrice")}
                </p>
                <p className="text-lg font-bold text-primary">
                  S/. {(r.prices[market] ?? 0).toFixed(2)}
                </p>
              </div>

              <div className="col-start-1 sm:col-start-auto">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("prices.trend")}
                </p>
                <p
                  className={`flex items-center gap-1 text-sm font-bold ${
                    up ? "text-success" : "text-terracotta"
                  }`}
                >
                  {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {up ? "+" : ""}
                  {r.trendPct.toFixed(1)}%
                </p>
              </div>

              <div className="col-start-2 row-start-2 justify-self-end sm:col-start-auto sm:row-start-auto">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("prices.history")}
                </p>
                <Sparkline data={r.history} up={up} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Profit calculator */}
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Calculator className="h-5 w-5 text-terracotta" /> {t("calc.title")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold">{t("calc.product")}</span>
            <select
              value={calcProduct}
              onChange={(e) => setCalcProduct(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base font-medium outline-none focus:border-primary"
            >
              {PRICE_ROWS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.emoji} {r.name} — S/. {(r.prices[market] ?? 0).toFixed(2)}/kg
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{t("calc.kg")}</span>
            <input
              type="number"
              min={0}
              value={kg}
              onChange={(e) => setKg(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base font-medium outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{t("calc.cost")}</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base font-medium outline-none focus:border-primary"
            />
          </label>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {t("calc.revenue")}
            </p>
            <p className="text-2xl font-bold">S/. {revenue.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-secondary-foreground/70">
              {t("calc.profit")}
            </p>
            <p className={`text-2xl font-bold ${profit >= 0 ? "text-primary" : "text-destructive"}`}>
              S/. {profit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}