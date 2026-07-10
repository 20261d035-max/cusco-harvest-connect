import { ArrowRight, Check, PartyPopper } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useAppState, type Role } from "@/lib/app-store";
import { useI18n, type Lang } from "@/lib/i18n";

type L = Record<Lang, string>;

interface Question {
  id: string;
  label: L;
  options: { value: string; label: L }[];
}

const l = (es: string, en: string, qu: string): L => ({ es, en, qu });

export const QUESTIONS: Record<Role, Question[]> = {
  farmer: [
    {
      id: "crops",
      label: l("¿Qué productos cultivas?", "What products do you grow?", "¿Ima rurukunatan tarpunki?"),
      options: [
        { value: "papa-nativa", label: l("Papa nativa", "Native potatoes", "Papa") },
        { value: "maiz-blanco", label: l("Maíz blanco gigante", "Giant white corn", "Sara") },
        { value: "quinua", label: l("Quinua / kiwicha", "Quinoa / kiwicha", "Kinuwa / kiwicha") },
        { value: "verduras", label: l("Habas y verduras", "Fava beans & vegetables", "Hawas, yuyukuna") },
      ],
    },
    {
      id: "market",
      label: l(
        "¿A qué mercado local sueles ir?",
        "Which local market do you usually visit?",
        "¿Mayqin qhatumanmi riq kanki?",
      ),
      options: [
        { value: "huancaro", label: l("Huancaro", "Huancaro", "Huancaro") },
        { value: "sanpedro", label: l("San Pedro", "San Pedro", "San Pedro") },
        { value: "vinocanchon", label: l("Vinocanchón", "Vinocanchón", "Vinocanchón") },
        { value: "feria", label: l("Feria de mi distrito", "My district's fair", "Llaqtaypa qhatun") },
      ],
    },
    {
      id: "b2b",
      label: l(
        "¿Te interesa vender a grandes empresas?",
        "Are you interested in selling to big enterprises?",
        "¿Hatun rantiqkunaman qhatuyta munawaqchu?",
      ),
      options: [
        { value: "yes", label: l("¡Sí, claro!", "Yes, of course!", "¡Arí!") },
        { value: "maybe", label: l("Quiero saber más", "I want to know more", "Astawan yachayta munani") },
        { value: "no", label: l("Por ahora no", "Not for now", "Manaraq") },
      ],
    },
  ],
  consumer: [
    {
      id: "buys",
      label: l(
        "¿Qué productos locales compras más?",
        "What local products do you buy the most?",
        "¿Ima rurukunatan astawan rantinki?",
      ),
      options: [
        { value: "tuberculos", label: l("Papa y tubérculos", "Potatoes & tubers", "Papa, ulluku") },
        { value: "granos", label: l("Quinua y granos andinos", "Quinoa & Andean grains", "Kinuwa, granokuna") },
        { value: "verduras", label: l("Verduras frescas", "Fresh vegetables", "Yuyukuna") },
        { value: "maiz", label: l("Maíz blanco", "White corn", "Sara") },
      ],
    },
    {
      id: "organic",
      label: l(
        "¿Prefieres productos orgánicos/agroecológicos?",
        "Do you prefer organic/agroecological products?",
        "¿Allin tarpusqa mikhunata munankichu?",
      ),
      options: [
        { value: "yes", label: l("Sí, siempre", "Yes, always", "Arí, sapa kuti") },
        { value: "sometimes", label: l("A veces", "Sometimes", "Maynillanpi") },
        { value: "no", label: l("No es prioridad", "Not a priority", "Mana ancha") },
      ],
    },
    {
      id: "area",
      label: l("¿En qué zona de Cusco estás?", "What area of Cusco are you in?", "¿May Qosqo llaqtapin tiyanki?"),
      options: [
        { value: "cusco", label: l("Cusco ciudad", "Cusco city", "Qosqo llaqta") },
        { value: "valle", label: l("Valle Sagrado (Calca/Urubamba)", "Sacred Valley", "Willkamayu wayq'u") },
        { value: "anta", label: l("Anta", "Anta", "Anta") },
        { value: "canchis", label: l("Canchis / Sicuani", "Canchis / Sicuani", "Canchis") },
      ],
    },
  ],
  enterprise: [
    {
      id: "volume",
      label: l(
        "¿Qué volumen de abastecimiento necesitas?",
        "What volume of supply do you need?",
        "¿Hayk'a rurutan munanki?",
      ),
      options: [
        { value: "small", label: l("Hasta 500 kg/semana", "Up to 500 kg/week", "500 kg/semana kama") },
        { value: "medium", label: l("500 – 2,000 kg/semana", "500 – 2,000 kg/week", "500–2,000 kg/semana") },
        { value: "large", label: l("Más de 2,000 kg", "More than 2,000 kg", "2,000 kg aswan") },
        { value: "campaign", label: l("Por campaña", "Per season", "Sapa campaña") },
      ],
    },
    {
      id: "trace",
      label: l(
        "¿Requieres certificados de trazabilidad de origen?",
        "Do you require origin traceability certificates?",
        "¿Maymanta hamusqan qillqata munankichu?",
      ),
      options: [
        { value: "yes", label: l("Sí, obligatorio", "Yes, mandatory", "Arí, munasqan") },
        { value: "nice", label: l("Deseable", "Nice to have", "Allinmi kanman") },
        { value: "no", label: l("No necesario", "Not needed", "Mana necesario") },
      ],
    },
    {
      id: "type",
      label: l("¿Qué tipo de negocio eres?", "What type of business are you?", "¿Ima negocio kanki?"),
      options: [
        { value: "hotel", label: l("Hotel", "Hotel", "Hatun qorpachana") },
        { value: "restaurant", label: l("Restaurante", "Restaurant", "Mikhuna wasi") },
        { value: "supermarket", label: l("Supermercado", "Supermarket", "Hatun qhatu") },
        { value: "exporter", label: l("Agroexportador", "Agro-exporter", "Hawa suyuman apaq") },
      ],
    },
  ],
};

export function OnboardingModal() {
  const { role, onboardingOpen, setOnboardingOpen, saveAnswers } = useAppState();
  const { lang, t } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (!role) return null;
  const questions = QUESTIONS[role];
  const q = questions[Math.min(step, questions.length - 1)];

  const close = () => {
    setOnboardingOpen(false);
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  const pick = (value: string) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      saveAnswers(role, next);
      setDone(true);
    }
  };

  return (
    <Modal open={onboardingOpen} onClose={close}>
      <div className="p-6 sm:p-8">
        {done ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <PartyPopper className="h-8 w-8 text-primary" />
            </span>
            <h2 className="text-2xl font-bold">{t("onb.finish")}</h2>
            <p className="text-sm text-muted-foreground">
              {t(`role.${role}.desc` as const)}
            </p>
            <button
              onClick={close}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform active:scale-95"
            >
              {t("cta.enter")} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta">
              {t(`role.${role}` as const)} · {step + 1}/{questions.length}
            </p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl">{t("onb.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("onb.subtitle")}</p>

            <div className="mt-4 flex gap-1.5">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            <p className="mt-6 text-lg font-semibold">{q.label[lang]}</p>
            <div className="mt-4 grid gap-2.5">
              {q.options.map((op) => (
                <button
                  key={op.value}
                  onClick={() => pick(op.value)}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left text-base font-semibold transition-colors ${
                    answers[q.id] === op.value
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50"
                  }`}
                >
                  {op.label[lang]}
                  {answers[q.id] === op.value && <Check className="h-5 w-5 text-primary" />}
                </button>
              ))}
            </div>

            <button
              onClick={close}
              className="mt-5 w-full text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            >
              {t("onb.skip")}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}