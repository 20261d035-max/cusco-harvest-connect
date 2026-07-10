import { QRCodeSVG } from "qrcode.react";
import {
  CalendarDays,
  Droplets,
  Leaf,
  MapPin,
  Mountain,
  Quote,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
} from "lucide-react";
import type { Listing } from "@/lib/mock-data";
import { useI18n, type Lang } from "@/lib/i18n";

export function waLink(listing: Listing, lang: Lang) {
  const msgs: Record<Lang, string> = {
    es: `¡Hola ${listing.farmer}! 👋 Vi tu ${listing.product} (${listing.variety}) en Qhatu Cusco a S/. ${listing.pricePerKg.toFixed(2)}/kg y me interesa comprar. ¿Sigue disponible?`,
    en: `Hello ${listing.farmer}! 👋 I saw your ${listing.product} (${listing.variety}) on Qhatu Cusco at S/. ${listing.pricePerKg.toFixed(2)}/kg and I'm interested in buying. Is it still available?`,
    qu: `¡Rimaykullayki ${listing.farmer}! 👋 Qhatu Qosqopi ${listing.product} ruruykita rikurqani, S/. ${listing.pricePerKg.toFixed(2)}/kg. Rantiyta munani. ¿Kachkanraqchu?`,
  };
  return `https://wa.me/${listing.phone}?text=${encodeURIComponent(msgs[lang])}`;
}

export function TraceabilityCard({ listing }: { listing: Listing }) {
  const { t, lang } = useI18n();

  const timeline = [
    {
      icon: Sprout,
      title: { es: "Siembra en altura", en: "Planted in the highlands", qu: "Tarpuy" }[lang],
      desc: `${listing.community}, ${listing.district} · ${listing.trace.altitude}`,
    },
    {
      icon: Droplets,
      title: { es: "Cultivo y riego", en: "Growing & irrigation", qu: "Qarpay" }[lang],
      desc: `${listing.trace.irrigation} · ${listing.trace.method}`,
    },
    {
      icon: CalendarDays,
      title: { es: "Cosecha", en: "Harvest", qu: "Cosecha" }[lang],
      desc: new Date(listing.trace.harvestDate + "T12:00:00").toLocaleDateString(
        lang === "en" ? "en-US" : "es-PE",
        { day: "numeric", month: "long", year: "numeric" },
      ),
    },
    {
      icon: Store,
      title: { es: "Publicado en Qhatu", en: "Published on Qhatu", qu: "Qhatupi churasqa" }[lang],
      desc: { es: "Venta directa, sin intermediarios", en: "Direct sale, no middlemen", qu: "Chiqan qhatuy" }[lang],
    },
    {
      icon: Truck,
      title: { es: "A tu mesa", en: "To your table", qu: "Mikhunaykiman" }[lang],
      desc: { es: "Coordina la entrega por WhatsApp", en: "Arrange delivery via WhatsApp", qu: "WhatsApp-pi rimanakuy" }[lang],
    },
  ];

  const qrPayload = JSON.stringify({
    app: "Qhatu Cusco",
    id: listing.id,
    product: listing.product,
    farmer: listing.farmer,
    community: listing.community,
    district: listing.district,
    harvest: listing.trace.harvestDate,
  });

  return (
    <div>
      <div className="bg-primary px-6 pb-5 pt-6 text-primary-foreground sm:px-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
          <ShieldCheck className="h-4 w-4" /> {t("trace.title")}
        </p>
        <h2 className="mt-2 text-2xl font-bold">{listing.product}</h2>
        <p className="text-sm opacity-90">{listing.variety}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm opacity-90">
          <MapPin className="h-4 w-4" /> {listing.community} · {listing.district}, Cusco
        </p>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Mountain, label: t("trace.altitude"), value: listing.trace.altitude },
            { icon: Droplets, label: t("trace.irrigation"), value: listing.trace.irrigation },
            { icon: Leaf, label: t("trace.method"), value: listing.trace.method },
            {
              icon: CalendarDays,
              label: t("trace.harvest"),
              value: new Date(listing.trace.harvestDate + "T12:00:00").toLocaleDateString("es-PE"),
            },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-muted p-3.5">
              <item.icon className="h-5 w-5 text-primary" />
              <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <p className="text-sm font-semibold leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-terracotta">
            {t("trace.journey")}
          </h3>
          <ol className="mt-4 space-y-0">
            {timeline.map((step, i) => (
              <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {i < timeline.length - 1 && (
                  <span className="absolute left-[18px] top-9 h-[calc(100%-2rem)] w-0.5 bg-border" />
                )}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary">
                  <step.icon className="h-4.5 w-4.5 h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-sm font-bold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-terracotta/40 bg-terracotta/5 p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta">
            <Quote className="h-4 w-4" /> {t("trace.story")}
          </p>
          <p className="mt-2 text-sm italic leading-relaxed">"{listing.trace.story}"</p>
          <p className="mt-3 text-sm font-bold">
            — {listing.farmer}
            <span className="block text-xs font-medium text-muted-foreground">
              {t("trace.community")}: {listing.community}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted p-5 text-center">
          <div className="rounded-xl bg-card p-3 shadow-sm">
            <QRCodeSVG value={qrPayload} size={128} fgColor="#2d4222" />
          </div>
          <p className="max-w-60 text-xs text-muted-foreground">{t("trace.scan")}</p>
        </div>

        <a
          href={waLink(listing, lang)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-success px-6 py-3.5 text-base font-bold text-primary-foreground transition-transform active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t("market.whatsapp")}
        </a>
      </div>
    </div>
  );
}