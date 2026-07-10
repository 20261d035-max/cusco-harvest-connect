import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en" | "qu";

type Entry = { es: string; en: string; qu: string };

const dict = {
  appName: { es: "Qhatu Cusco", en: "Qhatu Cusco", qu: "Qhatu Qosqo" },
  tagline: {
    es: "Del campo cusqueño a tu mesa, sin intermediarios",
    en: "From Cusco's fields to your table, no middlemen",
    qu: "Chakramanta mikhunaykikama, mana rantiq runakunawan",
  },
  heroSub: {
    es: "Precios justos de mercado, trazabilidad con QR y venta directa para productores y compradores de la región Cusco.",
    en: "Fair market prices, QR traceability and direct sales for farmers and buyers in the Cusco region.",
    qu: "Chanin qhatuykuna, QR qhawana, chakramanta chiqan qhatuy Qosqo suyupi.",
  },
  "nav.home": { es: "Inicio", en: "Home", qu: "Qallariy" },
  "nav.prices": { es: "Precios", en: "Prices", qu: "Chaninkuna" },
  "nav.market": { es: "Mercado", en: "Market", qu: "Qhatu" },
  "nav.sell": { es: "Vender", en: "Sell", qu: "Qhatuy" },
  "nav.b2b": { es: "Empresas", en: "Enterprises", qu: "Hatun rantiqkuna" },
  "nav.guide": { es: "¿Cómo funciona?", en: "How it works?", qu: "¿Imaynata rurakun?" },
  "role.farmer": { es: "Productor", en: "Farmer", qu: "Chakra runa" },
  "role.consumer": { es: "Comprador", en: "Consumer", qu: "Rantiq" },
  "role.enterprise": { es: "Empresa", en: "Enterprise", qu: "Hatun rantiq" },
  "role.switch": { es: "Cambiar rol", en: "Switch role", qu: "Rol t'ikray" },
  "role.farmer.desc": {
    es: "Consulta precios, publica tu cosecha y genera tu QR de trazabilidad.",
    en: "Check prices, post your harvest and generate your traceability QR.",
    qu: "Chaninkunata qhaway, cosechaykita qhatuy, QR ruray.",
  },
  "role.consumer.desc": {
    es: "Compra directo del productor y conoce la historia de tus alimentos.",
    en: "Buy directly from farmers and know the story of your food.",
    qu: "Chakra runamanta chiqanta rantiy, mikhunaykip willakuyninta riqsiy.",
  },
  "role.enterprise.desc": {
    es: "Publica requerimientos de volumen y recibe ofertas de cosecha directas.",
    en: "Post volume requirements and receive direct harvest bids.",
    qu: "Hatun rantinaykita willay, cosecha ofertakunata chaskiy.",
  },
  "cta.iAm": { es: "Yo soy...", en: "I am...", qu: "Ñuqa kani..." },
  "cta.enter": { es: "Entrar", en: "Enter", qu: "Yaykuy" },
  "cta.viewPrices": { es: "Ver precios de hoy", en: "See today's prices", qu: "Kunan chaninkunata qhaway" },
  "cta.explore": { es: "Explorar el mercado", en: "Explore the market", qu: "Qhatuta qhaway" },
  "prices.title": { es: "Precios de referencia — Cusco", en: "Reference prices — Cusco", qu: "Chaninkuna — Qosqo" },
  "prices.subtitle": {
    es: "Promedios por kilo actualizados en los principales mercados cusqueños.",
    en: "Average prices per kilo, updated at Cusco's main markets.",
    qu: "Sapa kilo chanin, Qosqo hatun qhatukunapi musuqchasqa.",
  },
  "prices.market": { es: "Mercado", en: "Market", qu: "Qhatu" },
  "prices.product": { es: "Producto", en: "Product", qu: "Ruru" },
  "prices.avgPrice": { es: "Precio prom. / kg", en: "Avg price / kg", qu: "Chanin / kg" },
  "prices.trend": { es: "Tendencia semanal", en: "Weekly trend", qu: "Semana puriynin" },
  "prices.history": { es: "Últimas 8 semanas", en: "Last 8 weeks", qu: "8 semana ñawpaq" },
  "prices.updated": { es: "Actualizado hoy, 6:00 a.m.", en: "Updated today, 6:00 a.m.", qu: "Kunan p'unchaw musuqchasqa, 6:00 a.m." },
  "calc.title": { es: "Calculadora rápida de ganancia", en: "Quick profit calculator", qu: "Usqhay qullqi yupana" },
  "calc.product": { es: "Producto", en: "Product", qu: "Ruru" },
  "calc.kg": { es: "Kilos a vender", en: "Kilos to sell", qu: "Hayk'a kilo qhatunki" },
  "calc.cost": { es: "Costo por kg (S/.)", en: "Cost per kg (S/.)", qu: "Sapa kilo gasto (S/.)" },
  "calc.revenue": { es: "Venta estimada", en: "Estimated revenue", qu: "Qhatusqa qullqi" },
  "calc.profit": { es: "Ganancia estimada", en: "Estimated profit", qu: "Llamk'aymanta qullqi" },
  "market.title": { es: "Mercado directo", en: "Direct marketplace", qu: "Chiqan qhatu" },
  "market.subtitle": {
    es: "Compra directo de productores de Calca, Urubamba, Anta y Canchis.",
    en: "Buy directly from farmers in Calca, Urubamba, Anta and Canchis.",
    qu: "Calca, Urubamba, Anta, Canchis chakra runakunamanta chiqanta rantiy.",
  },
  "market.organic": { es: "Agroecológico", en: "Agroecological", qu: "Allin tarpusqa" },
  "market.onlyOrganic": { es: "Solo agroecológicos", en: "Organic only", qu: "Allin tarpusqalla" },
  "market.all": { es: "Todos", en: "All", qu: "Llapan" },
  "market.viewTrace": { es: "Ver trazabilidad", en: "View traceability", qu: "Puriyninta qhaway" },
  "market.whatsapp": { es: "Contactar por WhatsApp", en: "Contact via WhatsApp", qu: "WhatsApp-pi rimanakuy" },
  "market.perKg": { es: "por kg", en: "per kg", qu: "sapa kilo" },
  "market.available": { es: "disponibles", en: "available", qu: "kachkan" },
  "trace.title": { es: "Certificado de Origen y Trazabilidad", en: "Origin & Traceability Certificate", qu: "Maymanta hamusqanpa qillqan" },
  "trace.journey": { es: "El viaje de tu alimento", en: "Your food's journey", qu: "Mikhunaykip purinin" },
  "trace.altitude": { es: "Altitud", en: "Elevation", qu: "Altura" },
  "trace.irrigation": { es: "Riego", en: "Irrigation", qu: "Qarpay" },
  "trace.method": { es: "Método de cultivo", en: "Farming method", qu: "Tarpuy ñan" },
  "trace.harvest": { es: "Fecha de cosecha", en: "Harvest date", qu: "Cosecha p'unchaw" },
  "trace.story": { es: "La historia de quien lo cultivó", en: "The story of who grew it", qu: "Tarpuqpa willakuynin" },
  "trace.community": { es: "Comunidad", en: "Community", qu: "Ayllu" },
  "trace.scan": { es: "Escanea este QR para compartir el certificado", en: "Scan this QR to share the certificate", qu: "Kay QR-ta qhaway willanakunapaq" },
  "sell.title": { es: "Registra tu producto", en: "Register your product", qu: "Ruruykita qillqay" },
  "sell.subtitle": {
    es: "Publica tu cosecha en minutos y obtén tu código QR de trazabilidad.",
    en: "Post your harvest in minutes and get your traceability QR code.",
    qu: "Cosechaykita usqhaylla qhatuy, QR unanchata chaskiy.",
  },
  "sell.name": { es: "Nombre del producto", en: "Product name", qu: "Rurup sutin" },
  "sell.variety": { es: "Variedad", en: "Variety", qu: "Rikch'aq" },
  "sell.volume": { es: "Volumen disponible (kg)", en: "Available volume (kg)", qu: "Hayk'a kilo kachkan" },
  "sell.price": { es: "Precio por kg (S/.)", en: "Price per kg (S/.)", qu: "Sapa kilo chanin (S/.)" },
  "sell.district": { es: "Distrito / Provincia", en: "District / Province", qu: "Llaqta / Provincia" },
  "sell.traceSection": { es: "Trazabilidad e Historia", en: "Traceability & Story", qu: "Puriynin willakuynin ima" },
  "sell.altitude": { es: "Altitud (msnm)", en: "Elevation (masl)", qu: "Altura (msnm)" },
  "sell.irrigation": { es: "Tipo de riego", en: "Irrigation type", qu: "Qarpay rikch'aq" },
  "sell.method": { es: "Método de cultivo", en: "Farming method", qu: "Tarpuy ñan" },
  "sell.harvestDate": { es: "Fecha de cosecha", en: "Harvest date", qu: "Cosecha p'unchaw" },
  "sell.community": { es: "Comunidad campesina", en: "Farming community", qu: "Ayllu" },
  "sell.story": { es: "Tu historia (cuéntale al comprador quién eres)", en: "Your story (tell buyers who you are)", qu: "Willakuyniyki (rantiqman willay pi kasqaykita)" },
  "sell.submit": { es: "Publicar y generar QR", en: "Publish & generate QR", qu: "Qhatuy, QR ruray" },
  "sell.success": { es: "¡Producto publicado con éxito!", en: "Product published successfully!", qu: "¡Ruruyki allinta qhatusqa!" },
  "sell.qrReady": {
    es: "Este es tu código QR único de trazabilidad. Imprímelo y pégalo en tus sacos o cajas.",
    en: "This is your unique traceability QR code. Print it and stick it on your sacks or boxes.",
    qu: "Kayqa QR unanchayki. Imprimiy, costalykiman k'askachiy.",
  },
  "sell.another": { es: "Registrar otro producto", en: "Register another product", qu: "Huk ruruta qillqay" },
  "sell.viewCert": { es: "Ver mi certificado", en: "View my certificate", qu: "Qillqayta qhaway" },
  "b2b.title": { es: "Alianza Comercial B2B", en: "B2B Commercial Alliance", qu: "Hatun qhatu rimanakuy" },
  "b2b.subtitle": {
    es: "Hoteles, restaurantes y agroexportadores publican sus requerimientos. Productores y asociaciones envían ofertas de cosecha directas.",
    en: "Hotels, restaurants and agro-exporters post requirements. Farmers and associations submit direct harvest bids.",
    qu: "Hatun wasikuna, mikhuna wasikuna rantinankuta willanku. Chakra runakuna ofertankuta apachinku.",
  },
  "b2b.needs": { es: "Requiere", en: "Needs", qu: "Munan" },
  "b2b.volume": { es: "Volumen", en: "Volume", qu: "Hayk'a" },
  "b2b.frequency": { es: "Frecuencia", en: "Frequency", qu: "Sapa hayk'aq" },
  "b2b.traceReq": { es: "Requiere trazabilidad", en: "Traceability required", qu: "Puriynin qillqa munasqa" },
  "b2b.bid": { es: "Enviar oferta de cosecha", en: "Submit harvest bid", qu: "Cosecha ofertata apachiy" },
  "b2b.bidSent": { es: "¡Oferta enviada! La empresa te contactará pronto.", en: "Bid sent! The company will contact you soon.", qu: "¡Oferta apachisqa! Empresa rimasunki." },
  "b2b.yourOffer": { es: "Tu oferta (kg y precio)", en: "Your offer (kg and price)", qu: "Ofertayki (kilo, chanin)" },
  "b2b.postReq": { es: "Publicar requerimiento", en: "Post requirement", qu: "Rantinaykita willay" },
  "guide.title": { es: "¿Cómo funciona Qhatu?", en: "How does Qhatu work?", qu: "¿Imaynata Qhatu rurakun?" },
  "guide.subtitle": {
    es: "Tres caminos simples según quién eres.",
    en: "Three simple paths depending on who you are.",
    qu: "Kimsa ñan, pi kasqaykiman hina.",
  },
  "onb.title": { es: "Cuéntanos de ti", en: "Tell us about you", qu: "Willawayku pin kanki" },
  "onb.subtitle": {
    es: "3 preguntas rápidas para personalizar tu experiencia",
    en: "3 quick questions to personalize your experience",
    qu: "Kimsa tapuykuna, qampaq allinchanapaq",
  },
  "onb.next": { es: "Siguiente", en: "Next", qu: "Qatiq" },
  "onb.finish": { es: "¡Listo, empezar!", en: "Done, let's start!", qu: "¡Listu, qallarisun!" },
  "onb.skip": { es: "Saltar por ahora", en: "Skip for now", qu: "Kunanqa saqiy" },
  "chat.title": { es: "Chat con Soporte", en: "Developer Support Chat", qu: "Yanapakuywan rimanakuy" },
  "chat.label": { es: "¿Dudas o Sugerencias?", en: "Questions or Suggestions?", qu: "¿Tapuykuna icha yuyaykuna?" },
  "chat.placeholder": { es: "Escribe tu pregunta o sugerencia...", en: "Type your question or suggestion...", qu: "Tapuyniykita qillqay..." },
  "chat.greeting": {
    es: "¡Hola! 👋 Somos el equipo de desarrollo de Qhatu. ¿En qué te podemos ayudar? Puedes preguntarnos sobre precios, cómo vender, el código QR o dejar una sugerencia.",
    en: "Hi! 👋 We're the Qhatu development team. How can we help? Ask us about prices, how to sell, the QR code, or leave a suggestion.",
    qu: "¡Rimaykullayki! 👋 Ñuqayku Qhatu ruraqkuna kayku. ¿Imapin yanapasqayki? Chaninmanta, qhatuymanta, QR-manta tapuway.",
  },
  "common.close": { es: "Cerrar", en: "Close", qu: "Wichq'ay" },
  "common.send": { es: "Enviar", en: "Send", qu: "Apachiy" },
  "common.soles": { es: "S/.", en: "S/.", qu: "S/." },
} satisfies Record<string, Entry>;

export type TKey = keyof typeof dict;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
}

const Ctx = createContext<I18nCtx>({ lang: "es", setLang: () => {}, t: (k) => dict[k].es });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("qhatu-lang") as Lang | null;
    if (saved === "es" || saved === "en" || saved === "qu") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("qhatu-lang", l);
  };

  const t = (k: TKey) => dict[k]?.[lang] ?? dict[k]?.es ?? k;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇵🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "qu", label: "Runasimi (Qosqo)", flag: "🏔️" },
];