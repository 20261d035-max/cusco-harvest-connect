import { MessagesSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";

interface Msg {
  from: "user" | "bot";
  text: string;
}

const REPLIES: { keywords: string[]; reply: Record<Lang, string> }[] = [
  {
    keywords: ["precio", "price", "chanin", "cuesta", "cost"],
    reply: {
      es: "Los precios de referencia se actualizan cada mañana con datos de Huancaro, San Pedro y Vinocanchón. Entra a la sección 'Precios' 🏷️ para ver el detalle por producto y la tendencia semanal.",
      en: "Reference prices update every morning with data from Huancaro, San Pedro and Vinocanchón markets. Check the 'Prices' 🏷️ section for details and weekly trends.",
      qu: "Chaninkunaqa sapa paqarin musuqchakun Huancaro, San Pedro qhatukunamanta. 'Chaninkuna' 🏷️ nisqapi qhaway.",
    },
  },
  {
    keywords: ["qr", "trazabilidad", "traceability", "certificado", "certificate"],
    reply: {
      es: "¡El QR es gratis! 📱 Cuando publicas tu producto en 'Vender', generamos automáticamente un código QR único. Imprímelo y pégalo en tus sacos: el comprador verá tu historia y el origen del producto.",
      en: "The QR is free! 📱 When you post your product in 'Sell', we automatically generate a unique QR code. Print it and stick it on your sacks — buyers will see your story and the product's origin.",
      qu: "¡QR-qa mana chaninchu! 📱 'Qhatuy' nisqapi ruruykita churaptiyki, QR unanchata ruwapusayki. Chaywan rantiqkuna willakuyniykita qhawananku.",
    },
  },
  {
    keywords: ["vender", "sell", "publicar", "qhatuy", "registrar"],
    reply: {
      es: "Para vender: 1️⃣ Entra a 'Vender', 2️⃣ llena el formulario con tu producto y tu historia, 3️⃣ publica y comparte tu QR. Los compradores te contactarán directo por WhatsApp. ¡Sin comisiones! 🌱",
      en: "To sell: 1️⃣ Go to 'Sell', 2️⃣ fill the form with your product and story, 3️⃣ publish and share your QR. Buyers will contact you directly on WhatsApp. No commissions! 🌱",
      qu: "Qhatunapaq: 1️⃣ 'Qhatuy' nisqaman riy, 2️⃣ formulario hunt'achiy, 3️⃣ QR-ta willanakuy. Rantiqkuna WhatsApp-pi rimasunki. ¡Mana comisión kanchu! 🌱",
    },
  },
  {
    keywords: ["empresa", "hotel", "restaurante", "b2b", "enterprise", "volumen"],
    reply: {
      es: "En 'Empresas' 💼 los hoteles y restaurantes publican lo que necesitan comprar. Si eres productor o asociación, puedes enviarles tu oferta de cosecha con un clic.",
      en: "In 'Enterprises' 💼 hotels and restaurants post what they need to buy. If you're a farmer or association, you can send them your harvest bid in one click.",
      qu: "'Hatun rantiqkuna' 💼 nisqapi hatun wasikuna rantinankuta willanku. Chakra runa kaspaqa ofertaykita apachiy.",
    },
  },
  {
    keywords: ["idioma", "language", "quechua", "runasimi", "english"],
    reply: {
      es: "Puedes cambiar el idioma con el botón del globo 🌐 arriba: Español, English o Runasimi (quechua Collao del Cusco). ¡Kusa!",
      en: "You can switch languages with the globe button 🌐 at the top: Español, English or Runasimi (Cusco Collao Quechua).",
      qu: "Simita t'ikranki 🌐 unanchawan: Español, English icha Runasimi. ¡Kusa!",
    },
  },
  {
    keywords: ["gracias", "thanks", "sulpayki", "genial"],
    reply: {
      es: "¡De nada! 💚 Estamos aquí para que el agro cusqueño crezca. Cualquier otra duda, escríbenos.",
      en: "You're welcome! 💚 We're here to help Cusco's agriculture grow. Write us anytime.",
      qu: "¡Imamanta! 💚 Qosqo chakra wiñananpaq kaypi kayku. Ima tapuyta apachimuway.",
    },
  },
  {
    keywords: ["sugerencia", "suggestion", "sugiero", "mejorar", "feature", "idea"],
    reply: {
      es: "¡Gracias por tu sugerencia! 📝 La hemos registrado y el equipo de desarrollo la revisará esta semana. Tu opinión hace crecer Qhatu.",
      en: "Thanks for your suggestion! 📝 We've logged it and the dev team will review it this week. Your feedback makes Qhatu grow.",
      qu: "¡Sulpayki yuyayniykimanta! 📝 Qillqarquniku, ruraqkuna kay semanapi qhawanqaku.",
    },
  },
];

const FALLBACK: Record<Lang, string> = {
  es: "¡Gracias por escribirnos! 🙌 Un desarrollador del equipo revisará tu mensaje. Mientras tanto, ¿te ayudo con algo sobre precios, cómo vender, el código QR o el portal de empresas?",
  en: "Thanks for writing! 🙌 A developer from the team will review your message. Meanwhile, can I help with prices, selling, the QR code or the enterprise portal?",
  qu: "¡Sulpayki qillqamusqaykimanta! 🙌 Huk ruraq qhawanqa. ¿Chaninmanta, qhatuymanta icha QR-manta yanapasqayki?",
};

export function SupportChat() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ from: "bot", text: t("chat.greeting") }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    const lower = text.toLowerCase();
    const match = REPLIES.find((r) => r.keywords.some((k) => lower.includes(k)));
    const reply = match ? match.reply[lang] : FALLBACK[lang];
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: reply }]);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-terracotta px-4 py-3 font-semibold text-terracotta-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
        >
          <MessagesSquare className="h-5 w-5" />
          <span className="hidden text-sm sm:inline">{t("chat.label")}</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[75dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:bottom-6 sm:right-6 sm:h-[520px] sm:w-96 sm:rounded-3xl">
          <div className="flex items-center gap-3 bg-primary px-4 py-3.5 text-primary-foreground">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
              <MessagesSquare className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{t("chat.title")}</p>
              <p className="flex items-center gap-1.5 text-xs opacity-80">
                <span className="h-2 w-2 rounded-full bg-maize" /> Equipo Qhatu · online
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t("common.close")}
              className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) =>
              m.from === "bot" ? (
                <div key={i} className="max-w-[85%] text-sm leading-relaxed">
                  {m.text}
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                    {m.text}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("chat.placeholder")}
              className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={send}
              aria-label={t("common.send")}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
              disabled={!input.trim() || typing}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}