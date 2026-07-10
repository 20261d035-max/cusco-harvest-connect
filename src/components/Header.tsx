import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  ChevronDown,
  Globe,
  HelpCircle,
  Home,
  ShoppingBasket,
  Sprout,
  Store,
  Tag,
  UserCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n } from "@/lib/i18n";
import { useAppState, type Role } from "@/lib/app-store";

const ROLE_ICON: Record<Role, typeof Sprout> = {
  farmer: Sprout,
  consumer: ShoppingBasket,
  enterprise: Briefcase,
};

function Dropdown({
  trigger,
  children,
  align = "right",
}: {
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        {trigger}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div
          className={`absolute top-full z-50 mt-2 min-w-48 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { role, setRole, hydrated } = useAppState();

  const navLinks = [
    { to: "/precios", label: t("nav.prices") },
    { to: "/mercado", label: t("nav.market") },
    { to: "/vender", label: t("nav.sell") },
    { to: "/empresas", label: t("nav.b2b") },
  ] as const;

  const currentLang = LANGS.find((l) => l.code === lang)!;
  const RoleIcon = role ? ROLE_ICON[role] : UserCircle2;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-4">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sprout className="h-6 w-6" />
          </span>
          <span className="hidden flex-col leading-tight xs:flex sm:flex">
            <span className="font-display text-lg font-bold tracking-tight">Qhatu</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta">
              Cusco
            </span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-2 text-sm font-semibold bg-secondary text-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/guia"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold bg-secondary text-primary" }}
          >
            <HelpCircle className="h-4 w-4" />
            {t("nav.guide")}
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <Dropdown trigger={<><Globe className="h-4 w-4 text-primary" /><span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span><span className="sm:hidden">{currentLang.flag}</span></>}>
            {(close) =>
              LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    close();
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary ${
                    l.code === lang ? "bg-secondary text-primary" : ""
                  }`}
                >
                  <span>{l.flag}</span> {l.label}
                </button>
              ))
            }
          </Dropdown>

          <Dropdown
            trigger={
              <>
                <RoleIcon className="h-4 w-4 text-terracotta" />
                <span className="hidden sm:inline">
                  {hydrated && role ? t(`role.${role}` as const) : t("role.switch")}
                </span>
              </>
            }
          >
            {(close) =>
              (["farmer", "consumer", "enterprise"] as Role[]).map((r) => {
                const Icon = ROLE_ICON[r];
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      close();
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary ${
                      role === r ? "bg-secondary text-primary" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4 text-primary" /> {t(`role.${r}` as const)}
                  </button>
                );
              })
            }
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useI18n();
  const items = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/precios", label: t("nav.prices"), icon: Tag },
    { to: "/mercado", label: t("nav.market"), icon: Store },
    { to: "/empresas", label: t("nav.b2b"), icon: Briefcase },
    { to: "/guia", label: t("nav.guide"), icon: HelpCircle },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            activeOptions={{ exact: it.to === "/" }}
            className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-muted-foreground"
            activeProps={{
              className: "flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-primary",
            }}
          >
            <it.icon className="h-5 w-5" />
            <span className="max-w-16 truncate">{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}