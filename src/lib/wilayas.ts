export type Wilaya = {
  id: number;
  name: string;
  domicile: number | null;
};

export const WILAYAS: Wilaya[] = [
  { id: 1,  name: "Adrar",               domicile: 1200 },
  { id: 2,  name: "Chlef",               domicile: 700  },
  { id: 3,  name: "Laghouat",            domicile: 700  },
  { id: 4,  name: "Oum El Bouaghi",      domicile: 700  },
  { id: 5,  name: "Batna",               domicile: 700  },
  { id: 6,  name: "Béjaïa",              domicile: 700  },
  { id: 7,  name: "Biskra",              domicile: 700  },
  { id: 8,  name: "Béchar",              domicile: 800  },
  { id: 9,  name: "Blida",               domicile: 500  },
  { id: 10, name: "Bouira",              domicile: 500  },
  { id: 11, name: "Tamanrasset",         domicile: 1200 },
  { id: 12, name: "Tébessa",             domicile: 700  },
  { id: 13, name: "Tlemcen",             domicile: 700  },
  { id: 14, name: "Tiaret",              domicile: 700  },
  { id: 15, name: "Tizi Ouzou",          domicile: 500  },
  { id: 16, name: "Alger",               domicile: 400  },
  { id: 17, name: "Djelfa",              domicile: 700  },
  { id: 18, name: "Jijel",               domicile: 700  },
  { id: 19, name: "Sétif",               domicile: 700  },
  { id: 20, name: "Saïda",               domicile: 700  },
  { id: 21, name: "Skikda",              domicile: 700  },
  { id: 22, name: "Sidi Bel Abbès",      domicile: 700  },
  { id: 23, name: "Annaba",              domicile: 700  },
  { id: 24, name: "Guelma",              domicile: 700  },
  { id: 25, name: "Constantine",         domicile: 700  },
  { id: 26, name: "Médéa",               domicile: 500  },
  { id: 27, name: "Mostaganem",          domicile: 700  },
  { id: 28, name: "M'Sila",              domicile: 700  },
  { id: 29, name: "Mascara",             domicile: 700  },
  { id: 30, name: "Ouargla",             domicile: 800  },
  { id: 31, name: "Oran",                domicile: 700  },
  { id: 32, name: "El Bayadh",           domicile: 700  },
  { id: 33, name: "Illizi",              domicile: 1200 },
  { id: 34, name: "Bordj Bou Arréridj",  domicile: 700  },
  { id: 35, name: "Boumerdès",           domicile: 500  },
  { id: 36, name: "El Tarf",             domicile: 700  },
  { id: 37, name: "Tindouf",             domicile: 1200 },
  { id: 38, name: "Tissemsilt",          domicile: 700  },
  { id: 39, name: "El Oued",             domicile: 700  },
  { id: 40, name: "Khenchela",           domicile: 700  },
  { id: 41, name: "Souk Ahras",          domicile: 700  },
  { id: 42, name: "Tipaza",              domicile: 500  },
  { id: 43, name: "Mila",                domicile: 700  },
  { id: 44, name: "Aïn Defla",           domicile: 500  },
  { id: 45, name: "Naama",               domicile: 700  },
  { id: 46, name: "Ain Témouchent",      domicile: 700  },
  { id: 47, name: "Ghardaia",            domicile: 700  },
  { id: 48, name: "Relizane",            domicile: 700  },
  { id: 49, name: "Timimoun",            domicile: 900  },
  { id: 50, name: "Bordj Badji Mokhtar", domicile: 1200 },
  { id: 51, name: "Ouled Djellal",       domicile: 700  },
  { id: 52, name: "Beni Abbes",          domicile: 900  },
  { id: 53, name: "In Salah",            domicile: 1200 },
  { id: 54, name: "In Guezzam",          domicile: null },
  { id: 55, name: "Touggourt",           domicile: 700  },
  { id: 56, name: "Djanet",              domicile: null },
  { id: 57, name: "EL M'Ghair",          domicile: 700  },
  { id: 58, name: "El Meniaa",           domicile: 800  },
];

export function getAvailableWilayas(): Wilaya[] {
  return WILAYAS.filter((w) => w.domicile !== null);
}

export function getDeliveryCost(wilayaId: number): number {
  const wilaya = WILAYAS.find((w) => w.id === wilayaId);
  return wilaya?.domicile ?? 700;
}
