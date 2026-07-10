import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Briefcase, MapPin, PackageCheck, Repeat, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useAppState } from "@/lib/app-store";
import { useI18n } from "@/lib/i18n";
import { REQUIREMENTS, type Requirement } from "@/lib/mock-data";

export const Route = createFileRoute("/empresas")({
  head: () => ({
    meta: [
      { title: "Portal B2B para hoteles y restaurantes — Qhatu Cusco" },
      {
        name: "description",
        content:
          "Hoteles de Urubamba, restaurantes y agroexportadores publican requerimientos; productores cusqueños envían ofertas de cosecha directas.",
      },
      { property: "og:title", content: "Portal B2B — Qhatu Cusco" },
      { property: "og:description", content: "Alianza comercial entre grandes compradores y productores de Cusco." },
    ],
  }),
  component: EmpresasPage,
});

function EmpresasPage() {
  const { t } = useI18n();
  const { role, answers } = useAppState();
  const [bidFor, setBidFor] = useState<Requirement | null>(null);
  const [bidText, setBidText] = useState("");
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [showPost, setShowPost] = useState(false);
  const [posted, setPosted] = useState(false);

  const entVolume = answers.enterprise?.volume;

  const sendBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidFor) setSentIds((s) => [...s, bidFor.id]);
    setBidFor(null);
    setBidText("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{t("b2b.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t("b2b.subtitle")}
          </p>
        </div>
        {role === "enterprise" && (
          <button
            onClick={() => {
              setShowPost(true);
              setPosted(false);
            }}
            className="hidden items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-terracotta-foreground transition-transform active:scale-95 sm:inline-flex"
          >
            <Briefcase className="h-4 w-4" /> {t("b2b.postReq")}
          </button>
        )}
      </div>

      {role === "enterprise" && entVolume && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
          <Sparkles className="h-4 w-4 shrink-0 text-terracotta" />
          Perfil de empresa configurado. Publica tu requerimiento y recibe ofertas de asociaciones de productores.
        </div>
      )}

      {role === "enterprise" && (
        <button
          onClick={() => {
            setShowPost(true);
            setPosted(false);
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3.5 text-sm font-bold text-terracotta-foreground sm:hidden"
        >
          <Briefcase className="h-4 w-4" /> {t("b2b.postReq")}
        </button>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {REQUIREMENTS.map((r) => {
          const sent = sentIds.includes(r.id);
          return (
            <article key={r.id} className="flex flex-col rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted text-2xl">
                  {r.emoji}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold">{r.company}</h2>
                  <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                    <span>{r.type}</span>·
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-terracotta" /> {r.location}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-sm">
                <p className="flex items-start gap-2">
                  <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span><strong>{t("b2b.needs")}:</strong> {r.product}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Scale className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span><strong>{t("b2b.volume")}:</strong> {r.volume} · {r.priceRef}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Repeat className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span><strong>{t("b2b.frequency")}:</strong> {r.frequency}</span>
                </p>
                {r.traceabilityRequired && (
                  <p className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" /> {t("b2b.traceReq")} (QR Qhatu ✓)
                  </p>
                )}
              </div>

              <button
                onClick={() => setBidFor(r)}
                disabled={sent}
                className={`mt-5 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-transform active:scale-95 ${
                  sent
                    ? "bg-secondary text-primary"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {sent ? (
                  <>
                    <BadgeCheck className="h-4 w-4" /> {t("b2b.bidSent")}
                  </>
                ) : (
                  t("b2b.bid")
                )}
              </button>
            </article>
          );
        })}
      </div>

      {/* Bid modal */}
      <Modal open={!!bidFor} onClose={() => setBidFor(null)}>
        {bidFor && (
          <form onSubmit={sendBid} className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta">{bidFor.company}</p>
            <h2 className="mt-1 text-xl font-bold">{t("b2b.bid")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {bidFor.product} · {bidFor.volume}
            </p>
            <label className="mt-5 block">
              <span className="text-sm font-semibold">{t("b2b.yourOffer")}</span>
              <textarea
                required
                rows={4}
                value={bidText}
                onChange={(e) => setBidText(e.target.value)}
                placeholder="Ej. Asociación Sumaq Kausay ofrece 800 kg de quinua orgánica a S/. 13.50/kg, entrega quincenal en Urubamba..."
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-transform active:scale-95"
            >
              {t("common.send")}
            </button>
          </form>
        )}
      </Modal>

      {/* Post requirement modal (mock) */}
      <Modal open={showPost} onClose={() => setShowPost(false)}>
        <div className="p-6 sm:p-8">
          {posted ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <BadgeCheck className="h-12 w-12 text-primary" />
              <h2 className="text-xl font-bold">¡Requerimiento publicado!</h2>
              <p className="text-sm text-muted-foreground">
                Los productores y asociaciones de la región ya pueden ver tu solicitud y enviarte ofertas.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPosted(true);
              }}
            >
              <h2 className="text-xl font-bold">{t("b2b.postReq")}</h2>
              <div className="mt-4 grid gap-3">
                <input required placeholder="Empresa (ej. Hotel Río Sagrado)" className="rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none focus:border-primary" />
                <input required placeholder="Producto requerido (ej. papa nativa)" className="rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none focus:border-primary" />
                <input required placeholder="Volumen y frecuencia (ej. 400 kg/semana)" className="rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none focus:border-primary" />
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-terracotta px-6 py-3.5 text-base font-bold text-terracotta-foreground transition-transform active:scale-95"
              >
                {t("b2b.postReq")}
              </button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}