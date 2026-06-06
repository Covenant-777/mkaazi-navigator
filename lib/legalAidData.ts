export interface LegalAidContact {
  id: string;
  name: string;
  category: 'free_legal_aid' | 'government' | 'police' | 'emergency';
  phone: string;
  alternativePhone?: string;
  email?: string;
  location: string;
  description: {
    en: string;
    sw: string;
    sheng: string;
  };
  hours?: string;
  website?: string;
}

export const legalAidContacts: LegalAidContact[] = [
  {
    id: "kituo-cha-sheria",
    name: "Kituo cha Sheria",
    category: "free_legal_aid",
    phone: "020-2244082",
    alternativePhone: "0722-522233",
    email: "info@kituochasheria.or.ke",
    location: "Nairobi (CBD)",
    description: {
      en: "Free legal aid, paralegal services, and legal awareness",
      sw: "Msaada wa kisheria bure, huduma za wakili msaidizi, na uhamasishaji wa sheria",
      sheng: "Free legal help, paralegal services, and legal awareness"
    },
    hours: "Monday-Friday, 8am-5pm",
    website: "https://kituochasheria.or.ke"
  },
  {
    id: "fida-kenya",
    name: "FIDA Kenya",
    category: "free_legal_aid",
    phone: "020-2713911",
    alternativePhone: "0722-201061",
    email: "info@fidakenya.org",
    location: "Nairobi (Milimani)",
    description: {
      en: "Legal aid for women and children's rights",
      sw: "Msaada wa kisheria kwa haki za wanawake na watoto",
      sheng: "Legal help for women and children rights"
    },
    hours: "Monday-Friday, 8am-5pm",
    website: "https://fidakenya.org"
  },
  {
    id: "law-society-kenya",
    name: "Law Society of Kenya (LSK)",
    category: "free_legal_aid",
    phone: "0709-906000",
    email: "info@lsk.or.ke",
    location: "Nairobi (Lavington)",
    description: {
      en: "Lawyer referral service and pro bono programs",
      sw: "Huduma ya kutafuta wakili na mipango ya kutoa huduma bure",
      sheng: "Lawyer referral and free legal programs"
    },
    hours: "Monday-Friday, 8am-5pm",
    website: "https://lsk.or.ke"
  },
  {
    id: "knhcr",
    name: "KNCHR (Kenya National Commission on Human Rights)",
    category: "government",
    phone: "020-2733000",
    email: "info@knchr.org",
    location: "Nairobi (Upper Hill)",
    description: {
      en: "Human rights complaints and legal assistance",
      sw: "Malalamiko ya haki za binadamu na msaada wa kisheria",
      sheng: "Human rights complaints and legal help"
    },
    hours: "Monday-Friday, 8am-5pm",
    website: "https://knchr.org"
  },
  {
    id: "rent-restriction-tribunal",
    name: "Rent Restriction Tribunal",
    category: "government",
    phone: "020-2225621",
    location: "Nairobi (City Hall)",
    description: {
      en: "Handle landlord-tenant disputes, rent control cases",
      sw: "Hushughulikia mizozo ya mwenye nyumba na mpangaji, kesi za udhibiti wa kodi",
      sheng: "Handles landlord-tenant cases, rent disputes"
    },
    hours: "Monday-Friday, 8am-4pm"
  },
  {
    id: "police-999",
    name: "Police Emergency",
    category: "police",
    phone: "999",
    alternativePhone: "112",
    location: "Nationwide",
    description: {
      en: "Emergency police response for urgent threats or illegal lockouts",
      sw: "Jibu la dharura la polisi kwa vitisho vya dharura au kufungiwa nje kinyume cha sheria",
      sheng: "Emergency police for urgent threats or illegal lockouts"
    },
    hours: "24/7"
  }
];