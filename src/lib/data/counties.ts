// ============================================================
// KENYA COUNTIES DATA (all 47)
// ============================================================

export interface CountyData {
  name: string;
  slug: string;
  capital: string;
}

export const KENYA_COUNTIES: CountyData[] = [
  { name: 'Nairobi', slug: 'nairobi', capital: 'Nairobi' },
  { name: 'Mombasa', slug: 'mombasa', capital: 'Mombasa' },
  { name: 'Kisumu', slug: 'kisumu', capital: 'Kisumu' },
  { name: 'Nakuru', slug: 'nakuru', capital: 'Nakuru' },
  { name: 'Uasin Gishu', slug: 'uasin-gishu', capital: 'Eldoret' },
  { name: 'Kiambu', slug: 'kiambu', capital: 'Kiambu' },
  { name: 'Machakos', slug: 'machakos', capital: 'Machakos' },
  { name: 'Kakamega', slug: 'kakamega', capital: 'Kakamega' },
  { name: 'Meru', slug: 'meru', capital: 'Meru' },
  { name: 'Embu', slug: 'embu', capital: 'Embu' },
  { name: 'Nyeri', slug: 'nyeri', capital: 'Nyeri' },
  { name: "Murang'a", slug: 'muranga', capital: "Murang'a" },
  { name: 'Kirinyaga', slug: 'kirinyaga', capital: 'Kerugoya' },
  { name: 'Nyandarua', slug: 'nyandarua', capital: 'Ol Kalou' },
  { name: 'Laikipia', slug: 'laikipia', capital: 'Nanyuki' },
  { name: 'Nandi', slug: 'nandi', capital: 'Kapsabet' },
  { name: 'Bungoma', slug: 'bungoma', capital: 'Bungoma' },
  { name: 'Trans Nzoia', slug: 'trans-nzoia', capital: 'Kitale' },
  { name: 'Kisii', slug: 'kisii', capital: 'Kisii' },
  { name: 'Homa Bay', slug: 'homa-bay', capital: 'Homa Bay' },
  { name: 'Migori', slug: 'migori', capital: 'Migori' },
  { name: 'Kilifi', slug: 'kilifi', capital: 'Kilifi' },
  { name: 'Kwale', slug: 'kwale', capital: 'Kwale' },
  { name: 'Taita Taveta', slug: 'taita-taveta', capital: 'Voi' },
  { name: 'Lamu', slug: 'lamu', capital: 'Lamu' },
  { name: 'Tana River', slug: 'tana-river', capital: 'Hola' },
  { name: 'Garissa', slug: 'garissa', capital: 'Garissa' },
  { name: 'Wajir', slug: 'wajir', capital: 'Wajir' },
  { name: 'Mandera', slug: 'mandera', capital: 'Mandera' },
  { name: 'Marsabit', slug: 'marsabit', capital: 'Marsabit' },
  { name: 'Isiolo', slug: 'isiolo', capital: 'Isiolo' },
  { name: 'Samburu', slug: 'samburu', capital: 'Maralal' },
  { name: 'Turkana', slug: 'turkana', capital: 'Lodwar' },
  { name: 'West Pokot', slug: 'west-pokot', capital: 'Kapenguria' },
  { name: 'Elgeyo Marakwet', slug: 'elgeyo-marakwet', capital: 'Iten' },
  { name: 'Baringo', slug: 'baringo', capital: 'Kabarnet' },
  { name: 'Bomet', slug: 'bomet', capital: 'Bomet' },
  { name: 'Kericho', slug: 'kericho', capital: 'Kericho' },
  { name: 'Nyamira', slug: 'nyamira', capital: 'Nyamira' },
  { name: 'Siaya', slug: 'siaya', capital: 'Siaya' },
  { name: 'Busia', slug: 'busia', capital: 'Busia' },
  { name: 'Vihiga', slug: 'vihiga', capital: 'Vihiga' },
  { name: 'Tharaka Nithi', slug: 'tharaka-nithi', capital: 'Chuka' },
  { name: 'Kitui', slug: 'kitui', capital: 'Kitui' },
  { name: 'Makueni', slug: 'makueni', capital: 'Wote' },
  { name: 'Kajiado', slug: 'kajiado', capital: 'Kajiado' },
  { name: 'Narok', slug: 'narok', capital: 'Narok' },
];

export const UNIQUE_COUNTIES = [...new Map(KENYA_COUNTIES.map(c => [c.name, c])).values()];

export const TOP_COUNTIES = UNIQUE_COUNTIES.slice(0, 12);

export function getCountyBySlug(slug: string): CountyData | undefined {
  return UNIQUE_COUNTIES.find(c => c.slug === slug);
}

export function getCountyByName(name: string): CountyData | undefined {
  return UNIQUE_COUNTIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}