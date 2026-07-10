import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Handshake,
  MessageCircle,
  PackageSearch,
  QrCode,
  ShoppingBasket,
  Sprout,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";
import type { Role } from "@/lib/app-store";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "¿Cómo funciona? Guía básica — Qhatu Cusco" },
      {
        name: "description",
        content:
          "Guía paso a paso para productores, compradores y empresas: precios, venta directa, trazabilidad QR y alianzas B2B.",
      },
      { property: "og:title", content: "¿Cómo funciona? — Qhatu Cusco" },
      { property: "og:description", content: "Guía básica para usar Qhatu en tres pasos según tu rol." },
    ],
  }),
  component: GuiaPage,
});

type L = Record<Lang, string>;
const l = (es: string, en: string, qu: string): L => ({ es, en, qu });

const STEPS: Record<Role, { icon: typeof Sprout; title: L; desc: L }[]> = {
  farmer: [
    {
      icon: Tag,
      title: l("1. Consulta los precios", "1. Check prices", "1. Chaninkunata qhaway"),
      desc: l(
        "Revisa cada mañana los precios de Huancaro, San Pedro y Vinocanchón para saber cuánto vale tu cosecha antes de negociar.",
        "Check Huancaro, San Pedro and Vinocanchón prices every morning to know what your harvest is worth before negotiating.",
        "Sapa paqarin Huancaro, San Pedro chaninkunata qhaway, cosechayki chaninta yachanaykipaq.",
      ),
    },
    {
      icon: QrCode,
      title: l("2. Publica con tu historia", "2. Post with your story", "2. Willakuyniykiwan qhatuy"),
      desc: l(
        "Registra tu producto en 'Vender' con altitud, riego y tu historia. Recibirás un QR único para tus sacos: tu certificado de origen.",
        "Register your product in 'Sell' with elevation, irrigation and your story. You'll get a unique QR for your sacks: your origin certificate.",
        "'Qhatuy' nisqapi ruruykita qillqay. QR unanchata chaskinky costalykipaq.",
      ),
    },
    {
      icon: MessageCircle,
      title: l("3. Vende directo", "3. Sell directly", "3. Chiqanta qhatuy"),
      desc: l(
        "Los compradores te escriben directo a tu WhatsApp. Sin intermediarios ni comisiones. También puedes ofertar a hoteles y empresas en 'Empresas'.",
        "Buyers message you directly on WhatsApp. No middlemen, no commissions. You can also bid to hotels and companies in 'Enterprises'.",
        "Rantiqkuna WhatsApp-niykiman qillqamusunki. Mana rantiq runakuna kanchu.",
      ),
    },
  ],
  consumer: [
    {
      icon: PackageSearch,
      title: l("1. Explora el mercado", "1. Explore the market", "1. Qhatuta qhaway"),
      desc: l(
        "Encuentra papa nativa, maíz blanco, quinua y más, directo de productores de Calca, Urubamba, Anta y Canchis.",
        "Find native potatoes, white corn, quinoa and more, directly from farmers in Calca, Urubamba, Anta and Canchis.",
        "Papa, sara, kinuwa taripay, chakra runakunamanta chiqanta.",
      ),
    },
    {
      icon: QrCode,
      title: l("2. Conoce el origen", "2. Know the origin", "2. Maymanta hamusqanta riqsiy"),
      desc: l(
        "Toca 'Ver trazabilidad' o escanea el QR del producto para ver dónde y cómo se cultivó, y la historia real de quien lo sembró.",
        "Tap 'View traceability' or scan the product QR to see where and how it was grown, and the real story of who planted it.",
        "QR-ta qhaway, maypi imayna tarpusqa kasqanta riqsinaykipaq.",
      ),
    },
    {
      icon: MessageCircle,
      title: l("3. Compra por WhatsApp", "3. Buy via WhatsApp", "3. WhatsApp-pi rantiy"),
      desc: l(
        "Contacta al productor con un clic y coordina entrega y pago directamente. Tu compra apoya a familias campesinas cusqueñas.",
        "Contact the farmer in one click and arrange delivery and payment directly. Your purchase supports Cusco farming families.",
        "Chakra runawan rimanakuy, apachimunanta parlanakuy. Rantisqaykiqa ayllukunata yanapanmi.",
      ),
    },
  ],
  enterprise: [
    {
      icon: Briefcase,
      title: l("1. Publica tu requerimiento", "1. Post your requirement", "1. Rantinaykita willay"),
      desc: l(
        "Indica producto, volumen, frecuencia y si necesitas trazabilidad. Ideal para hoteles del Valle Sagrado, restaurantes y exportadores.",
        "State product, volume, frequency and whether you need traceability. Ideal for Sacred Valley hotels, restaurants and exporters.",
        "Ima rurutachus, hayk'atachus munasqaykita willay.",
      ),
    },
    {
      icon: Handshake,
      title: l("2. Recibe ofertas de cosecha", "2. Receive harvest bids", "2. Ofertakunata chaskiy"),
      desc: l(
        "Productores y asociaciones te envían sus ofertas directas con precio, volumen y certificado QR de origen.",
        "Farmers and associations send you direct bids with price, volume and QR origin certificate.",
        "Chakra runakuna ofertankuta apachimusunki, QR qillqantin.",
      ),
    },
    {
      icon: QrCode,
      title: l("3. Compra con trazabilidad", "3. Buy with traceability", "3. Puriynin yachasqa rantiy"),
      desc: l(
        "Cada lote llega con su certificado de origen escaneable: altitud, método de cultivo y comunidad. Perfecto para tu carta o tu exportación.",
        "Each batch arrives with a scannable origin certificate: elevation, farming method and community. Perfect for your menu or export.",
        "Sapa apachisqa QR qillqayuqmi chayamun: altura, tarpuy ñan, ayllu ima.",
      ),
    },
  ],
};

const TAB_META: { role: Role; icon: typeof Sprout }[] = [
  { role: "farmer", icon: Sprout },
  { role: "consumer", icon: ShoppingBasket },
  { role: "enterprise", icon: Briefcase },
];

function GuiaPage() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Role>("farmer");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">{t("guide.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground sm:text-base">{t("guide.subtitle")}</p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {TAB_META.map(({ role, icon: Icon }) => (
          <button
            key={role}
            onClick={() => setTab(role)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-sm font-bold transition-colors sm:flex-row sm:justify-center ${
              tab === role
                ? "border-primary bg-secondary text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            <Icon className="h-5 w-5" />
            {t(`role.${role}` as const)}
          </button>
        ))}
      </div>

      <ol className="mt-8 space-y-5">
        {STEPS[tab].map((s, i) => (
          <li key={i} className="relative flex gap-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
            {i < STEPS[tab].length - 1 && (
              <span className="absolute left-[42px] top-full h-5 w-0.5 bg-border sm:left-[46px]" />
            )}
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground sm:h-14 sm:w-14">
              <s.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold">{s.title[lang]}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {s.desc[lang]}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to={tab === "farmer" ? "/vender" : tab === "consumer" ? "/mercado" : "/empresas"}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-transform active:scale-95"
        >
          {t("cta.enter")}
        </Link>
      </div>
    </div>
  );
}