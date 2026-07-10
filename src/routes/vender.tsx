import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck, BookOpen, QrCode, Sprout } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { TraceabilityCard } from "@/components/TraceabilityCard";
import { useI18n } from "@/lib/i18n";
import { DISTRICTS, IMAGES, type Listing } from "@/lib/mock-data";

export const Route = createFileRoute("/vender")({
  head: () => ({
    meta: [
      { title: "Vende tu cosecha con QR — Qhatu Cusco" },
      {
        name: "description",
        content:
          "Registra tu producto agrícola, cuenta tu historia y genera un código QR de trazabilidad único para tus sacos.",
      },
      { property: "og:title", content: "Vende tu cosecha con QR — Qhatu Cusco" },
      { property: "og:description", content: "Publica tu cosecha y genera tu QR de trazabilidad gratis." },
    ],
  }),
  component: VenderPage,
});

const IRRIGATION_OPTIONS = ["Secano (lluvia)", "Gravedad", "Aspersión", "Goteo tecnificado"];
const METHOD_OPTIONS = ["Agroecológico / orgánico", "Tradicional andino", "Manejo integrado"];

function guessImage(name: string) {
  const n = name.toLowerCase();
  if (n.includes("papa")) return IMAGES.papa;
  if (n.includes("ma")) return IMAGES.maiz;
  if (n.includes("quin") || n.includes("kiwi")) return IMAGES.quinua;
  if (n.includes("hab")) return IMAGES.habas;
  if (n.includes("ollu")) return IMAGES.olluco;
  if (n.includes("ceb")) return IMAGES.cebolla;
  return IMAGES.papa;
}

function VenderPage() {
  const { t } = useI18n();
  const [published, setPublished] = useState<Listing | null>(null);
  const [showCert, setShowCert] = useState(false);
  const [form, setForm] = useState({
    product: "",
    variety: "",
    volume: "",
    price: "",
    district: DISTRICTS[0] as string,
    farmer: "",
    community: "",
    altitude: "",
    irrigation: IRRIGATION_OPTIONS[0],
    method: METHOD_OPTIONS[0],
    harvestDate: "",
    story: "",
    phone: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const listing: Listing = {
      id: `qhatu-${Date.now().toString(36)}`,
      product: form.product,
      variety: form.variety || "—",
      image: guessImage(form.product),
      farmer: form.farmer || "Productor(a) de Cusco",
      community: form.community || "Comunidad campesina",
      district: form.district,
      pricePerKg: Number(form.price) || 0,
      volumeKg: Number(form.volume) || 0,
      organic: form.method === METHOD_OPTIONS[0],
      phone: form.phone.replace(/\D/g, "") || "51984000000",
      trace: {
        altitude: form.altitude ? `${form.altitude} msnm` : "3,400 msnm",
        irrigation: form.irrigation,
        method: form.method,
        harvestDate: form.harvestDate || new Date().toISOString().slice(0, 10),
        story: form.story || "Producto cultivado con cariño en la región Cusco.",
      },
    };
    setPublished(listing);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (published) {
    const qrPayload = JSON.stringify({
      app: "Qhatu Cusco",
      id: published.id,
      product: published.product,
      farmer: published.farmer,
      district: published.district,
      harvest: published.trace.harvestDate,
    });
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
          <BadgeCheck className="h-9 w-9 text-primary" />
        </span>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{t("sell.success")}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
          {t("sell.qrReady")}
        </p>

        <div className="mx-auto mt-6 inline-block rounded-3xl border-2 border-dashed border-primary/40 bg-card p-6 shadow-sm">
          <QRCodeSVG value={qrPayload} size={200} fgColor="#2d4222" />
          <p className="mt-3 font-display text-sm font-bold text-primary">
            {published.product} · {published.district}
          </p>
          <p className="text-xs text-muted-foreground">ID: {published.id}</p>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => setShowCert(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-transform active:scale-95"
          >
            <QrCode className="h-5 w-5" /> {t("sell.viewCert")}
          </button>
          <button
            onClick={() => setPublished(null)}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3.5 text-base font-bold text-primary transition-colors hover:bg-secondary"
          >
            <Sprout className="h-5 w-5" /> {t("sell.another")}
          </button>
        </div>

        <Modal open={showCert} onClose={() => setShowCert(false)} wide>
          <TraceabilityCard listing={published} />
        </Modal>
      </div>
    );
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base font-medium outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">{t("sell.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground sm:text-base">{t("sell.subtitle")}</p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Sprout className="h-5 w-5 text-primary" /> {t("prices.product")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">{t("sell.name")} *</span>
              <input required value={form.product} onChange={set("product")} placeholder="Ej. Papa nativa" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.variety")}</span>
              <input value={form.variety} onChange={set("variety")} placeholder="Ej. Qompis" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.district")}</span>
              <select value={form.district} onChange={set("district")} className={inputCls}>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.volume")} *</span>
              <input required type="number" min={1} value={form.volume} onChange={set("volume")} placeholder="500" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.price")} *</span>
              <input required type="number" min={0.1} step={0.1} value={form.price} onChange={set("price")} placeholder="3.00" className={inputCls} />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">WhatsApp</span>
              <input value={form.phone} onChange={set("phone")} placeholder="51 984 123 456" className={inputCls} />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-terracotta/30 bg-terracotta/5 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold text-terracotta">
            <BookOpen className="h-5 w-5" /> {t("sell.traceSection")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.altitude")}</span>
              <input type="number" value={form.altitude} onChange={set("altitude")} placeholder="3800" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.harvestDate")}</span>
              <input type="date" value={form.harvestDate} onChange={set("harvestDate")} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.irrigation")}</span>
              <select value={form.irrigation} onChange={set("irrigation")} className={inputCls}>
                {IRRIGATION_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.method")}</span>
              <select value={form.method} onChange={set("method")} className={inputCls}>
                {METHOD_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Tu nombre</span>
              <input value={form.farmer} onChange={set("farmer")} placeholder="Ej. Justina Quispe" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t("sell.community")}</span>
              <input value={form.community} onChange={set("community")} placeholder="Ej. C.C. Umasbamba" className={inputCls} />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">{t("sell.story")}</span>
              <textarea rows={3} value={form.story} onChange={set("story")} placeholder="Ej. Soy la tercera generación de mi familia cultivando papa nativa..." className={inputCls} />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-bold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          <QrCode className="h-6 w-6" /> {t("sell.submit")}
        </button>
      </form>
    </div>
  );
}