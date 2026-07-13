import papaImg from "@/assets/papa-nativa.jpg";
import maizImg from "@/assets/maiz-blanco.jpg";
import quinuaImg from "@/assets/quinua.jpg";
import habasImg from "@/assets/habas.jpg";
import ollucoImg from "@/assets/olluco.jpg.asset.json";
import cebollaImg from "@/assets/cebolla.jpg";

export const DISTRICTS = [
  "Calca",
  "Urubamba",
  "Anta",
  "Canchis (Sicuani)",
  "Chinchero",
  "Písac",
  "Ollantaytambo",
  "Quispicanchi (Urcos)",
  "Paucartambo",
  "Cusco (ciudad)",
] as const;

export const MARKETS = [
  { id: "huancaro", name: "Mercado de Productores de Huancaro" },
  { id: "sanpedro", name: "Mercado Central de San Pedro" },
  { id: "vinocanchon", name: "Mercado Vinocanchón (San Jerónimo)" },
] as const;

export interface PriceRow {
  id: string;
  name: string;
  emoji: string;
  prices: Record<string, number>; // market id -> S/. per kg
  trendPct: number; // weekly change %
  history: number[]; // 8 weeks
}

export const PRICE_ROWS: PriceRow[] = [
  {
    id: "papa-nativa",
    name: "Papa nativa",
    emoji: "🥔",
    prices: { huancaro: 2.8, sanpedro: 3.2, vinocanchon: 2.9 },
    trendPct: 5.2,
    history: [2.4, 2.5, 2.45, 2.6, 2.55, 2.65, 2.7, 2.8],
  },
  {
    id: "maiz-blanco",
    name: "Maíz blanco gigante",
    emoji: "🌽",
    prices: { huancaro: 8.5, sanpedro: 9.2, vinocanchon: 8.8 },
    trendPct: -2.1,
    history: [9.0, 9.1, 8.9, 8.8, 8.7, 8.75, 8.65, 8.5],
  },
  {
    id: "quinua",
    name: "Quinua",
    emoji: "🌾",
    prices: { huancaro: 12.0, sanpedro: 13.5, vinocanchon: 12.4 },
    trendPct: 3.4,
    history: [11.2, 11.4, 11.3, 11.6, 11.5, 11.7, 11.8, 12.0],
  },
  {
    id: "habas",
    name: "Habas verdes",
    emoji: "🫛",
    prices: { huancaro: 3.2, sanpedro: 3.8, vinocanchon: 3.4 },
    trendPct: 8.1,
    history: [2.7, 2.8, 2.85, 2.9, 3.0, 3.05, 3.1, 3.2],
  },
  {
    id: "olluco",
    name: "Olluco (papalisa)",
    emoji: "🍠",
    prices: { huancaro: 3.5, sanpedro: 4.0, vinocanchon: 3.7 },
    trendPct: 1.5,
    history: [3.3, 3.35, 3.4, 3.38, 3.42, 3.45, 3.48, 3.5],
  },
  {
    id: "cebolla",
    name: "Cebolla roja",
    emoji: "🧅",
    prices: { huancaro: 2.1, sanpedro: 2.5, vinocanchon: 2.2 },
    trendPct: -4.3,
    history: [2.4, 2.35, 2.3, 2.28, 2.25, 2.2, 2.15, 2.1],
  },
  {
    id: "kiwicha",
    name: "Kiwicha",
    emoji: "🌱",
    prices: { huancaro: 12.5, sanpedro: 13.8, vinocanchon: 12.9 },
    trendPct: 0.8,
    history: [12.2, 12.3, 12.25, 12.35, 12.4, 12.42, 12.45, 12.5],
  },
];

export interface Listing {
  id: string;
  product: string;
  variety: string;
  image: string;
  farmer: string;
  community: string;
  district: string;
  pricePerKg: number;
  volumeKg: number;
  organic: boolean;
  phone: string;
  trace: {
    altitude: string;
    irrigation: string;
    method: string;
    harvestDate: string;
    story: string;
  };
}

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    product: "Papa nativa",
    variety: "Qompis y Peruanita (mix 12 variedades)",
    image: papaImg,
    farmer: "Justina Quispe Mamani",
    community: "C.C. Umasbamba",
    district: "Chinchero",
    pricePerKg: 3.0,
    volumeKg: 450,
    organic: true,
    phone: "51984123456",
    trace: {
      altitude: "3,780 msnm",
      irrigation: "Secano (lluvia)",
      method: "Agroecológico ancestral, rotación de laymes",
      harvestDate: "2026-06-15",
      story:
        "Soy Justina, tercera generación de guardianas de papa nativa en Umasbamba. Cultivamos más de 40 variedades con abono de ovino y sin químicos, como nos enseñaron nuestros abuelos.",
    },
  },
  {
    id: "l2",
    product: "Maíz blanco gigante",
    variety: "Blanco Urubamba (D.O.)",
    image: maizImg,
    farmer: "Eusebio Huamán Ccori",
    community: "C.C. Yucay",
    district: "Urubamba",
    pricePerKg: 9.0,
    volumeKg: 1200,
    organic: false,
    phone: "51987654321",
    trace: {
      altitude: "2,870 msnm",
      irrigation: "Riego por gravedad (río Vilcanota)",
      method: "Tradicional del Valle Sagrado",
      harvestDate: "2026-06-28",
      story:
        "Mi familia cultiva el auténtico maíz blanco gigante con denominación de origen del Valle Sagrado desde hace 60 años. Cada mazorca se selecciona a mano.",
    },
  },
  {
    id: "l3",
    product: "Quinua orgánica",
    variety: "Blanca de Junín y Pasankalla",
    image: quinuaImg,
    farmer: "Asociación Sumaq Kausay",
    community: "C.C. Pampallacta",
    district: "Calca",
    pricePerKg: 13.0,
    volumeKg: 2000,
    organic: true,
    phone: "51999888777",
    trace: {
      altitude: "3,950 msnm",
      irrigation: "Secano con cosecha de agua",
      method: "Orgánico certificado (en transición SGP)",
      harvestDate: "2026-05-30",
      story:
        "Somos 24 familias de Pampallacta unidas para producir quinua orgánica de altura. Parte de la venta financia la escuela de nuestra comunidad.",
    },
  },
  {
    id: "l4",
    product: "Habas verdes",
    variety: "Haba verde serrana",
    image: habasImg,
    farmer: "Rosalía Ccahuana Puma",
    community: "C.C. Markjo",
    district: "Anta",
    pricePerKg: 3.5,
    volumeKg: 300,
    organic: true,
    phone: "51955444333",
    trace: {
      altitude: "3,400 msnm",
      irrigation: "Aspersión comunal",
      method: "Agroecológico con biol propio",
      harvestDate: "2026-07-02",
      story:
        "En la pampa de Anta cultivo habas dulces y tiernas. Preparo mi propio biol y comparto lo aprendido con las señoras de mi comité de mujeres.",
    },
  },
  {
    id: "l5",
    product: "Olluco",
    variety: "Olluco amarillo y rosado",
    image: ollucoImg.url,
    farmer: "Mario Condori Huillca",
    community: "C.C. Raqchi",
    district: "Canchis (Sicuani)",
    pricePerKg: 3.8,
    volumeKg: 250,
    organic: false,
    phone: "51966777888",
    trace: {
      altitude: "3,550 msnm",
      irrigation: "Secano",
      method: "Tradicional con guano de corral",
      harvestDate: "2026-06-20",
      story:
        "Cerca del templo de Raqchi mi familia siembra olluco como lo hacían los antiguos. Fresco, recién escarbado, directo a su mesa.",
    },
  },
  {
    id: "l6",
    product: "Cebolla roja",
    variety: "Roja arequipeña adaptada",
    image: cebollaImg,
    farmer: "Felícitas Auccapuma",
    community: "C.C. Huayllabamba",
    district: "Urubamba",
    pricePerKg: 2.3,
    volumeKg: 600,
    organic: false,
    phone: "51933222111",
    trace: {
      altitude: "2,900 msnm",
      irrigation: "Riego tecnificado por goteo",
      method: "Manejo integrado de plagas",
      harvestDate: "2026-07-05",
      story:
        "Con el riego por goteo que instalamos en Huayllabamba ahorramos agua y sacamos cebolla pareja todo el año para los mercados de Cusco.",
    },
  },
];

export interface Requirement {
  id: string;
  company: string;
  type: string;
  location: string;
  product: string;
  volume: string;
  frequency: string;
  priceRef: string;
  traceabilityRequired: boolean;
  emoji: string;
}

export const REQUIREMENTS: Requirement[] = [
  {
    id: "r1",
    company: "Hotel Valle Sagrado Lodge",
    type: "Hotel 5★",
    location: "Urubamba",
    product: "Verduras agroecológicas mixtas + papa nativa",
    volume: "300 kg / semana",
    frequency: "Semanal",
    priceRef: "S/. 3.50 – 4.20 / kg",
    traceabilityRequired: true,
    emoji: "🏨",
  },
  {
    id: "r2",
    company: "Restaurante Pachamanka Cusco",
    type: "Restaurante turístico",
    location: "Cusco (ciudad)",
    product: "Quinua, kiwicha y maíz blanco gigante",
    volume: "120 kg / semana",
    frequency: "Semanal",
    priceRef: "S/. 12.00 – 14.00 / kg (quinua)",
    traceabilityRequired: true,
    emoji: "🍽️",
  },
  {
    id: "r3",
    company: "Supermercados Orión Cusco",
    type: "Supermercado regional",
    location: "Cusco / Sicuani",
    product: "Cebolla, zanahoria, habas y olluco",
    volume: "2,500 kg / quincena",
    frequency: "Quincenal",
    priceRef: "Precio de mercado Huancaro − 5%",
    traceabilityRequired: false,
    emoji: "🛒",
  },
  {
    id: "r4",
    company: "Agroexportadora Sumaq Andes SAC",
    type: "Agroexportador",
    location: "Cusco → Lima / EE.UU.",
    product: "Quinua orgánica certificada",
    volume: "5,000 kg / campaña",
    frequency: "Por campaña",
    priceRef: "S/. 14.50 / kg (con certificación)",
    traceabilityRequired: true,
    emoji: "✈️",
  },
];

export const IMAGES: Record<string, string> = {
  papa: papaImg,
  maiz: maizImg,
  quinua: quinuaImg,
  habas: habasImg,
  olluco: ollucoImg.url,
  cebolla: cebollaImg,
};