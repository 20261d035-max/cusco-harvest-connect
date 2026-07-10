import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  QrCode,
  ShoppingBasket,
  Sprout,
  Tag,
} from "lucide-react";
import heroImg from "@/assets/hero-cusco.jpg";
import { useI18n } from "@/lib/i18n";
import { useAppState, type Role } from "@/lib/app-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const { setRole } = useAppState();
  const navigate = useNavigate();

  const roles: { role: Role; icon: typeof Sprout; to: "/precios" | "/mercado" | "/empresas" }[] = [
    { role: "farmer", icon: Sprout, to: "/precios" },
    { role: "consumer", icon: ShoppingBasket, to: "/mercado" },
    { role: "enterprise", icon: Briefcase, to: "/empresas" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Terrazas agrícolas andinas en el Valle Sagrado, Cusco"
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/20" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-end px-4 pb-10 pt-32 sm:pb-14 sm:pt-44">
          <span className="rounded-full bg-terracotta px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-terracotta-foreground">
            Región Cusco · Perú
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-primary-foreground sm:text-5xl">
            {t("tagline")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            {t("heroSub")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/precios"
              className="inline-flex items-center gap-2 rounded-full bg-maize px-6 py-3.5 text-base font-bold text-foreground transition-transform active:scale-95"
            >
              <Tag className="h-5 w-5" /> {t("cta.viewPrices")}
            </Link>
            <Link
              to="/mercado"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary-foreground/60 px-6 py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              {t("cta.explore")}
            </Link>
          </div>
        </div>
      </section>

      {/* Role selection */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("cta.iAm")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {roles.map(({ role, icon: Icon, to }) => (
            <button
              key={role}
              onClick={() => {
                setRole(role);
                navigate({ to });
              }}
              className="group flex flex-col items-start gap-3 rounded-3xl border-2 border-border bg-card p-6 text-left transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-7 w-7" />
              </span>
              <span className="text-xl font-bold">{t(`role.${role}` as const)}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {t(`role.${role}.desc` as const)}
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-terracotta">
                {t("cta.enter")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Value strip */}
      <section className="border-y border-border bg-secondary/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
          {[
            {
              icon: Tag,
              title: { key: "prices.title" as const },
              desc: "Huancaro · San Pedro · Vinocanchón",
            },
            {
              icon: QrCode,
              title: { key: "trace.title" as const },
              desc: "QR único por cada cosecha registrada",
            },
            {
              icon: MapPin,
              title: { key: "market.title" as const },
              desc: "Calca · Urubamba · Anta · Canchis",
            },
          ].map((f) => (
            <div key={f.desc} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-bold leading-snug">{t(f.title.key)}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted-foreground">
        Qhatu Cusco · Hecho con 💚 para el agro cusqueño · Datos de precios referenciales (demo)
      </footer>
    </div>
  );
}
