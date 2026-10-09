/** Governorates with common residential areas, for the delivery form. */
export const governorates: Array<{ id: string; en: string; ar: string; areas: string[] }> = [
  { id: 'capital', en: 'Capital', ar: 'العاصمة', areas: ['Kuwait City', 'Dasman', 'Sharq', 'Mirqab', 'Qibla', 'Bneid Al-Qar', 'Dasma', 'Daiya', 'Mansouriya', 'Abdullah Al-Salem', 'Nuzha', 'Faiha', 'Shamiya', 'Rawda', 'Adailiya', 'Khaldiya', 'Kaifan', 'Qadsiya', 'Yarmouk', 'Surra', 'Shuwaikh', 'Sulaibikhat', 'Doha', 'Granada', 'Qairawan'] },
  { id: 'hawalli', en: 'Hawalli', ar: 'حولي', areas: ['Hawalli', 'Salmiya', 'Jabriya', 'Rumaithiya', 'Salwa', 'Bayan', 'Mishref', 'Mubarak Al-Abdullah', 'Shaab', 'Shuhada', 'Hittin', 'Siddiq', 'Zahra', 'Salam', 'Al-Bidea'] },
  { id: 'farwaniya', en: 'Farwaniya', ar: 'الفروانية', areas: ['Farwaniya', 'Khaitan', 'Jleeb Al-Shuyoukh', 'Abbasiya', 'Ardiya', 'Andalous', 'Rabiya', 'Rehab', 'Omariya', 'Firdous', 'Ishbiliya', 'Riggae', 'Abdullah Al-Mubarak', 'Sabah Al-Nasser', 'Dhajeej'] },
  { id: 'ahmadi', en: 'Ahmadi', ar: 'الأحمدي', areas: ['Ahmadi', 'Fintas', 'Mahboula', 'Mangaf', 'Abu Halifa', 'Fahaheel', 'Sabahiya', 'Riqqa', 'Hadiya', 'Egaila', 'Dhaher', 'Jaber Al-Ali', 'Sabah Al-Ahmad', 'Khairan', 'Wafra'] },
  { id: 'jahra', en: 'Jahra', ar: 'الجهراء', areas: ['Jahra', 'Qasr', 'Naeem', 'Oyoun', 'Taima', 'Waha', 'Saad Al-Abdullah', 'Amghara', 'Sulaibiya', 'Abdali'] },
  { id: 'mubarak', en: 'Mubarak Al-Kabeer', ar: 'مبارك الكبير', areas: ['Mubarak Al-Kabeer', 'Qurain', 'Qusour', 'Adan', 'Sabah Al-Salem', 'Messila', 'Abu Fatira', 'Fnaitees', 'Abu Al-Hasaniya', 'Al-Masayel', 'Wista'] },
];

/** Kuwaiti mobiles are 8 digits starting with 4, 5, 6 or 9. Accepts +965 / 00965 prefixes. */
export function normalizeKuwaitPhone(input: string): string | null {
  const digits = input.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/\D/g, '');
  const local = digits.replace(/^(00965|965)/, '');
  return /^[4569]\d{7}$/.test(local) ? `+965${local}` : null;
}
