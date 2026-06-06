"use client";

import { useState, useEffect } from "react";
import { generateTenantPDF, generateBuyerPDF } from "@/lib/pdfGenerator";
import { saveCalculation, getSavedCalculations, deleteCalculation, clearAllCalculations, SavedCalculation } from "@/lib/storage";
import { legalAidContacts } from "@/lib/legalAidData";
import { shareLegalNotice, sharePropertyReport, shareApp } from "@/lib/whatsappShare";
import { OfflineStatus } from "@/components/OfflineStatus";
import { InstallPrompt } from "@/components/InstallPrompt";
import { RentCalculator } from "@/components/RentCalculator";
import { SOSButton } from "@/components/SOSButton";

// Mantine Components
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Tabs,
  Select,
  Alert,
  Badge,
  Divider,
  Modal,
  Stack,
  Group,
  Radio,
  NumberInput,
  Loader,
  ThemeIcon,
  Card,
  ScrollArea,
  Space,
  Switch,
  useMantineColorScheme
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconScale,
  IconHome,
  IconHistory,
  IconTrash,
  IconDownload,
  IconRefresh,
  IconShield,
  IconAlertTriangle,
  IconHeart,
  IconDoor,
  IconBulb,
  IconMoodSad,
  IconCoin,
  IconTrendingUp,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconBuildingCommunity,
  IconMenu2,
  IconSun,
  IconMoon,
  IconCalculator,
  IconFileText
} from "@tabler/icons-react";

type Language = 'en' | 'sw' | 'sheng';

const translations: Record<Language, any> = {
  en: {
    title: "Mkaazi Navigator",
    subtitle: "Your Legal Rights Guardian",
    tenantMode: "Tenant Protection",
    buyerMode: "Property Buyer",
    calculatorMode: "Rent Calculator",
    history: "History",
    clearAll: "Clear All",
    noHistory: "No saved calculations yet",
    legalAidTitle: "Legal Aid Directory",
    shareWhatsApp: "Share via WhatsApp",
    shareApp: "Share App",
    call: "Call",
    allCategories: "All",
    freeLegalAid: "Free Legal Aid",
    government: "Government",
    emergency: "Emergency",
    scenario1: "Illegal Lockout / Eviction",
    scenario2: "Illegal Utility Shutoff",
    scenario3: "Harassment by Landlord",
    scenario4: "Deposit Refund Dispute",
    scenario5: "Unlawful Rent Increase",
    scenario6: "Illegal Entry by Landlord",
    scenario7: "Retaliatory Eviction",
    scenario8: "Landlord Won't Make Repairs",
    scenario9: "Harassment: Noise Complaints",
    scenario10: "Subletting Dispute",
    scenario11: "Landlord Won't Give Rent Receipt",
    scenario12: "Discrimination by Landlord",
    scenario13: "Unlawful Security Deposit",
    scenario14: "Unfair Utility Billing",
    scenario15: "Early Lease Termination",
    scenarioTitle: "Select Your Situation",
    question1: "Has your landlord issued a formal written eviction notice?",
    option1: "No, they locked me out without notice",
    option2: "Yes, I received a written notice",
    question2: "How many days notice did the letter specify?",
    option3: "Less than 30 days",
    option4: "30 days or more",
    verdict_illegal_lockout: "Your landlord cannot lock you out without a court order and 30 days written notice. This is a criminal offense under Kenyan law.",
    verdict_illegal_notice: "The Landlord & Tenant Act requires minimum 30 days written notice. Your landlord's notice is legally invalid.",
    verdict_valid_notice: "Valid notice period. Your landlord followed the legal requirement. Seek legal advice about your next steps.",
    verdict_utility_shutoff: "Landlords cannot shut off water or electricity to force eviction. This is harassment under Section 36 of the Landlord & Tenant Act.",
    verdict_harassment: "Threats, intimidation, or interference with peaceful enjoyment of property violates Section 41 of the Landlord & Tenant Act.",
    verdict_deposit_dispute: "Landlords must return deposits within 30 days of tenancy end or provide written reasons for deductions.",
    verdict_rent_increase: "Rent cannot be increased without proper notice (minimum 30 days). Controlled tenancies require approval from Rent Tribunal.",
    verdict_illegal_entry: "Landlords cannot enter your home without proper notice (24 hours) or without your consent except in emergencies. This violates your right to quiet enjoyment.",
    verdict_retaliatory_eviction: "It is illegal for a landlord to evict you because you reported a violation or requested repairs. This is retaliatory eviction and is prohibited by law.",
    verdict_repairs_needed: "Landlords are required to maintain the property in habitable condition. Failure to make necessary repairs violates the Landlord & Tenant Act.",
    verdict_noise_complaint: "While landlords can address noise issues, excessive harassment about normal living sounds may constitute harassment.",
    verdict_subletting_dispute: "Check your lease agreement. Many leases require landlord approval for subletting. Without approval, you may be in violation.",
    verdict_rent_receipt: "Landlords are required to provide rent receipts upon payment. Refusing to do so may indicate tax evasion.",
    verdict_discrimination: "Discrimination based on race, gender, religion, disability, or family status is illegal under Kenyan law.",
    verdict_security_deposit: "Security deposits cannot exceed one month's rent in most cases. Excessive deposit demands may be unlawful.",
    verdict_shared_utilities: "Landlords must fairly divide utility costs. Without proper metering, you may be paying more than your share.",
    verdict_lease_termination: "Check your lease terms. Early termination typically requires notice and may involve fees specified in your agreement.",
    download: "Download Legal Notice",
    startOver: "Start Over",
    generating: "Generating PDF...",
    propertyValue: "Property Value (KES)",
    propertyPlaceholder: "Enter amount in KES",
    urban: "Urban (City) - 4%",
    rural: "Rural (Land) - 2%",
    calculate: "Calculate",
    stampDuty: "Stamp Duty",
    legalFees: "Legal Fees (2%)",
    totalCost: "Total Cost",
    calculateAnother: "Calculate Another",
    savedOn: "Saved on",
    delete: "Delete",
    backToHome: "Back",
    tenantTag: "Tenant Rights",
    buyerTag: "Property Calculator",
    comingSoon: "Coming Soon",
    comingSoonDesc: "User accounts are coming in a future update!",
    localStorageNote: "For now, your data is saved locally on this device.",
    gotIt: "Got it",
    success: "Success",
    saved: "Calculation saved to history",
    pdfGenerated: "PDF Generated",
    pdfDownloaded: "Legal notice downloaded successfully",
    propertyReportDownloaded: "Property report downloaded successfully",
    menu: "Menu",
    rentCalculator: "Rent Affordability Calculator",
    monthlyRent: "Monthly Rent (KES)",
    monthlyIncome: "Monthly Income (KES)",
    calculateAffordability: "Calculate Affordability",
    affordable: "This rent is affordable (under 30% of income)",
    stretch: "This rent is a stretch (30-50% of income)",
    tooHigh: "This rent may be unaffordable (over 50% of income)",
    rentPercentage: "Rent as percentage of income",
    recommendation: "Recommendation",
    goodNews: "Good News!",
    attention: "Attention Needed",
    calculateAgain: "Calculate Again",
    affordabilityNote: "Experts recommend spending no more than 30% of income on rent.",
    emergencyHelp: "SOS",
    emergencyContacts: "Emergency Contacts",
    emergencyAlert: "EMERGENCY - Immediate Help Available",
    emergencyMessage: "If you're in immediate danger, call the police immediately using the numbers below.",
    sosNote: "These are emergency contacts. Only use for urgent legal or safety situations."
  },
  sw: {
    title: "Mkaazi Navigator",
    subtitle: "Mlinzi Wako wa Haki za Kisheria",
    tenantMode: "Ulinzi",
    buyerMode: "Mnunuzi",
    calculatorMode: "Kikokotozi",
    history: "Historia",
    clearAll: "Futa Zote",
    noHistory: "Hakuna hesabu zilizohifadhiwa",
    legalAidTitle: "Saraka",
    shareWhatsApp: "Shiriki",
    shareApp: "Shiriki App",
    call: "Piga",
    allCategories: "Zote",
    freeLegalAid: "Msaada Bure",
    government: "Serikali",
    emergency: "Dharura",
    scenario1: "Kufungiwa nje",
    scenario2: "Kukatwa Huduma",
    scenario3: "Dhuluma",
    scenario4: "Mzozo wa Amana",
    scenario5: "Ongezeko la Kodi",
    scenario6: "Kuingia Bila Ruhusa",
    scenario7: "Kufukuzwa Kwa Kulipiza Kisasi",
    scenario8: "Mwenye Nyumba Anakataa Kukarabati",
    scenario9: "Dhuluma: Malalamiko ya Kelele",
    scenario10: "Mzozo wa Kukodisha",
    scenario11: "Mwenye Nyumba Anakataa Risiti",
    scenario12: "Ubaguzi",
    scenario13: "Amana Isiyo Halali",
    scenario14: "Bili Isiyo Sawa",
    scenario15: "Kusitisha Ukodishaji Mapema",
    scenarioTitle: "Chagua Hali",
    question1: "Je, mwenye nyumba amekupa ilani rasmi ya maandishi?",
    option1: "Hapana, alinifungia mlango",
    option2: "Ndio, nilipata ilani",
    question2: "Ilani ilitaja siku ngapi?",
    option3: "Chini ya siku 30",
    option4: "Siku 30 au zaidi",
    verdict_illegal_lockout: "Mwenye nyumba hawezi kukufungia nje bila amri ya mahakama na ilani ya siku 30.",
    verdict_illegal_notice: "Sheria inahitaji ilani ya siku 30. Ilani hii ni batili kisheria.",
    verdict_valid_notice: "Ilani sahihi. Mwenye nyumba amefuata sheria.",
    verdict_utility_shutoff: "Mwenye nyumba hawezi kukata maji au umeme kukufukuza.",
    verdict_harassment: "Vitisho na vitendo vya kukusumbua ni kosa.",
    verdict_deposit_dispute: "Mwenye nyumba lazima arejeshe amana ndani ya siku 30.",
    verdict_rent_increase: "Kodi haiwezi kuongezwa bila ilani sahihi.",
    verdict_illegal_entry: "Mwenye nyumba hawezi kuingia nyumbani kwako bila ilani sahihi (saa 24) au idhini yako isipokuwa kwa dharura.",
    verdict_retaliatory_eviction: "Ni kinyume cha sheria kwa mwenye nyumba kukufukuza kwa sababu uliripoti ukiukaji au uliomba ukarabati.",
    verdict_repairs_needed: "Mwenye nyumba anatakiwa kudumisha nyumba katika hali nzuri. Kukataa kufanya ukarabati ni kukiuka sheria.",
    verdict_noise_complaint: "Ingawa mwenye nyumba anaweza kushughulikia kelele, unyanyasaji wa kupindukia juu ya kelele za kawaida unaweza kuwa unyanyasaji.",
    verdict_subletting_dispute: "Angalia mkataba wako. Mikataba mingi inahitaji idhini ya mwenye nyumba kwa kukodisha.",
    verdict_rent_receipt: "Mwenye nyumba anatakiwa kutoa risiti za kodi baada ya malipo. Kukataa kufanya hivyo kunaweza kuashiria ukwepaji kodi.",
    verdict_discrimination: "Ubaguzi kulingana na rangi, jinsia, dini, ulemavu, au hali ya familia ni kinyume cha sheria chini ya sheria ya Kenya.",
    verdict_security_deposit: "Amana za usalama haziwezi kuzidi kodi ya mwezi mmoja katika hali nyingi. Mahitaji makubwa ya amana yanaweza kuwa kinyume cha sheria.",
    verdict_shared_utilities: "Mwenye nyumba lazima agawanye gharama za huduma kwa haki. Bila upimaji sahihi, unaweza kulipa zaidi ya sehemu yako.",
    verdict_lease_termination: "Angalia masharti ya kukodisha. Kusitisha mapema kunahitaji ilani na kunaweza kuhusisha ada zilizoainishwa katika makubaliano yako.",
    download: "Pakua",
    startOver: "Anza",
    generating: "Inaunda...",
    propertyValue: "Thamani (KES)",
    propertyPlaceholder: "Weka kiasi",
    urban: "Mjini - 4%",
    rural: "Vijijini - 2%",
    calculate: "Kokotoa",
    stampDuty: "Stamp Duty",
    legalFees: "Ada",
    totalCost: "Jumla",
    calculateAnother: "Nyingine",
    savedOn: "Ilihifadhiwa",
    delete: "Futa",
    backToHome: "Rudi",
    tenantTag: "Haki",
    buyerTag: "Kikokotozi",
    comingSoon: "Inakuja",
    comingSoonDesc: "Akaunti za watumiaji zinakuja katika sasisho la baadaye!",
    localStorageNote: "Kwa sasa, data yako inahifadhiwa kwenye kifaa hiki.",
    gotIt: "Sawa",
    success: "Imefanikiwa",
    saved: "Imehifadhiwa",
    pdfGenerated: "PDF Imeundwa",
    pdfDownloaded: "Imepakuliwa",
    propertyReportDownloaded: "Ripoti imepakuliwa",
    menu: "Menyu",
    rentCalculator: "Kikokotozi cha Kodi",
    monthlyRent: "Kodi ya Mwezi (KES)",
    monthlyIncome: "Mapato ya Mwezi (KES)",
    calculateAffordability: "Kokotoa Uwezo",
    affordable: "Kodi hii inawezekana (chini ya 30% ya mapato)",
    stretch: "Kodi hii ni ngumu (30-50% ya mapato)",
    tooHigh: "Kodi hii inaweza kuwa kubwa (zaidi ya 50% ya mapato)",
    rentPercentage: "Asilimia ya kodi kwa mapato",
    recommendation: "Ushauri",
    goodNews: "Habari Njema!",
    attention: "Tahadhari Inahitajika",
    calculateAgain: "Kokotoa Tena",
    affordabilityNote: "Wataalamu wanapendekeza usitumie zaidi ya 30% ya mapato yako kwa kodi.",
    emergencyHelp: "Dharura",
    emergencyContacts: "Nambari za Dharura",
    emergencyAlert: "DHARURA - Msaada wa Haraka Unapatikana",
    emergencyMessage: "Ikiwa uko hatarini, piga polisi mara moja kwa nambari zilizo hapa chini.",
    sosNote: "Hizi ni nambari za dharura. Tumia tu kwa hali za hatari za kisheria au usalama."
  },
  sheng: {
    title: "Mkaazi Navigator",
    subtitle: "Your Legal Rights Guardian",
    tenantMode: "Tenant",
    buyerMode: "Buyer",
    calculatorMode: "Calculator",
    history: "History",
    clearAll: "Clear All",
    noHistory: "No saved calculations",
    legalAidTitle: "Legal Aid",
    shareWhatsApp: "Share",
    shareApp: "Share App",
    call: "Call",
    allCategories: "All",
    freeLegalAid: "Free Aid",
    government: "Gov",
    emergency: "Emergency",
    scenario1: "Lockout",
    scenario2: "Utility",
    scenario3: "Harass",
    scenario4: "Deposit",
    scenario5: "Rent",
    scenario6: "Illegal Entry",
    scenario7: "Retaliation",
    scenario8: "No Repairs",
    scenario9: "Noise Harass",
    scenario10: "Subletting",
    scenario11: "No Receipt",
    scenario12: "Discrimination",
    scenario13: "Bad Deposit",
    scenario14: "Bad Utilities",
    scenario15: "Early Termination",
    scenarioTitle: "Select Situation",
    question1: "Landlord amekuchorea notice?",
    option1: "Zii, ameweka kufuli",
    option2: "Eeh, ameshia barua",
    question2: "Hiyo barua inasema uondoke baada ya siku ngapi?",
    option3: "Chini ya mwezi",
    option4: "Mwezi ama zaidi",
    verdict_illegal_lockout: "Landlord hawezi kukuwekea kufuli bila court order.",
    verdict_illegal_notice: "Sheria inataka mwezi mmoja notice. Hii ni batili.",
    verdict_valid_notice: "Notice ni sahihi. Landlord amefuata sheria.",
    verdict_utility_shutoff: "Landlord hawezi kukata water au electricity.",
    verdict_harassment: "Threats na intimidation ni violation.",
    verdict_deposit_dispute: "Landlord must return deposit within 30 days.",
    verdict_rent_increase: "Rent cannot increase without proper notice.",
    verdict_illegal_entry: "Landlord cannot enter without 24hr notice or emergency.",
    verdict_retaliatory_eviction: "Cannot evict you for reporting violations.",
    verdict_repairs_needed: "Landlord must make repairs to keep house habitable.",
    verdict_noise_complaint: "Too much harassment about normal noise may be illegal.",
    verdict_subletting_dispute: "Check your lease - many require landlord approval.",
    verdict_rent_receipt: "Landlord must give receipt when you pay rent.",
    verdict_discrimination: "Discrimination based on race, gender, religion is illegal.",
    verdict_security_deposit: "Deposit cannot exceed one month's rent normally.",
    verdict_shared_utilities: "Landlord must fairly split utility costs.",
    verdict_lease_termination: "Check your lease - early termination may have fees.",
    download: "Download",
    startOver: "Start Over",
    generating: "Making PDF...",
    propertyValue: "Value (KES)",
    propertyPlaceholder: "Enter amount",
    urban: "Urban - 4%",
    rural: "Rural - 2%",
    calculate: "Calc",
    stampDuty: "Stamp Duty",
    legalFees: "Legal Fees",
    totalCost: "Total",
    calculateAnother: "Another",
    savedOn: "Saved on",
    delete: "Delete",
    backToHome: "Back",
    tenantTag: "Tenant",
    buyerTag: "Buyer",
    comingSoon: "Soon",
    comingSoonDesc: "User accounts coming soon!",
    localStorageNote: "Data saved locally.",
    gotIt: "Got it",
    success: "Success",
    saved: "Saved",
    pdfGenerated: "PDF Ready",
    pdfDownloaded: "Downloaded",
    propertyReportDownloaded: "Report downloaded",
    menu: "Menu",
    rentCalculator: "Rent Calculator",
    monthlyRent: "Monthly Rent (KES)",
    monthlyIncome: "Monthly Income (KES)",
    calculateAffordability: "Calculate",
    affordable: "This rent is affordable (under 30% of income)",
    stretch: "This rent is a stretch (30-50% of income)",
    tooHigh: "This rent may be unaffordable (over 50% of income)",
    rentPercentage: "Rent percentage",
    recommendation: "Recommendation",
    goodNews: "Good News!",
    attention: "Attention!",
    calculateAgain: "Calculate Again",
    affordabilityNote: "Experts say spend max 30% on rent.",
    emergencyHelp: "SOS",
    emergencyContacts: "Emergency Numbers",
    emergencyAlert: "EMERGENCY - Immediate Help",
    emergencyMessage: "If in danger, call police immediately.",
    sosNote: "Emergency contacts only for urgent situations."
  }
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string | null>("tenant");
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [historyModalOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);
  const [comingSoonOpened, { open: openComingSoon, close: closeComingSoon }] = useDisclosure(false);
  const [showLegalAid, setShowLegalAid] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [scenario, setScenario] = useState<string | null>(null);
  const [step, setStep] = useState("scenarioSelect");
  const [verdict, setVerdict] = useState<any>(null);
  
  const [propertyValue, setPropertyValue] = useState<number | null>(null);
  const [propertyType, setPropertyType] = useState("urban");
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const t = translations[language];

  useEffect(() => {
    setIsClient(true);
    setSavedCalculations(getSavedCalculations());
  }, []);

  const refreshHistory = () => {
    setSavedCalculations(getSavedCalculations());
  };

  const handleScenarioSelect = (selectedScenario: string) => {
    setScenario(selectedScenario);
    setStep("question1");
    setMobileMenuOpen(false);
  };

  const getVerdictMessage = (scenarioId: string, noticeValid?: string) => {
    const messages: Record<string, string> = {
      utility_shutoff: t.verdict_utility_shutoff,
      harassment: t.verdict_harassment,
      deposit_dispute: t.verdict_deposit_dispute,
      rent_increase: t.verdict_rent_increase,
      illegal_entry: t.verdict_illegal_entry,
      retaliatory_eviction: t.verdict_retaliatory_eviction,
      repairs_needed: t.verdict_repairs_needed,
      noise_complaint: t.verdict_noise_complaint,
      subletting_dispute: t.verdict_subletting_dispute,
      rent_receipt: t.verdict_rent_receipt,
      discrimination: t.verdict_discrimination,
      security_deposit: t.verdict_security_deposit,
      shared_utilities: t.verdict_shared_utilities,
      lease_termination: t.verdict_lease_termination,
    };
    
    if (messages[scenarioId]) return messages[scenarioId];
    if (noticeValid === "no") return t.verdict_illegal_lockout;
    if (noticeValid === "less") return t.verdict_illegal_notice;
    if (noticeValid === "more") return t.verdict_valid_notice;
    return t.verdict_illegal_lockout;
  };

  const showNotification = (message: string) => {
    notifications.show({
      title: t.success,
      message: message,
      color: "green",
      autoClose: 3000,
    });
  };

  const handleTenantAnswer = (answer: string) => {
    if (step === "question1") {
      if (answer === "no") {
        const message = getVerdictMessage(scenario || "lockout", "no");
        const verdictData = { type: "error", message, scenario };
        setVerdict(verdictData);
        saveCalculation("tenant", verdictData, language);
        refreshHistory();
        showNotification(t.saved);
      } else {
        setStep("question2");
      }
    } else if (step === "question2") {
      const message = getVerdictMessage(scenario || "lockout", answer);
      const verdictData = { 
        type: answer === "more" ? "success" : "warning", 
        message, 
        scenario 
      };
      setVerdict(verdictData);
      saveCalculation("tenant", verdictData, language);
      refreshHistory();
      showNotification(t.saved);
    }
  };

  const resetTenantFlow = () => {
    setScenario(null);
    setStep("scenarioSelect");
    setVerdict(null);
  };

  const calculateStampDuty = () => {
    if (!propertyValue || propertyValue <= 0) {
      notifications.show({
        title: "Error",
        message: "Please enter a valid property value",
        color: "red",
      });
      return;
    }
    
    const rate = propertyType === "urban" ? 0.04 : 0.02;
    const stampDuty = propertyValue * rate;
    const legalFees = propertyValue * 0.02;
    const total = stampDuty + legalFees;
    
    const result = {
      stampDuty,
      legalFees,
      total,
      rate: rate * 100,
      type: propertyType,
      propertyValue: propertyValue
    };
    
    setCalculationResult(result);
    saveCalculation("buyer", result, language);
    refreshHistory();
    showNotification(t.saved);
  };
  
  const clearCalculation = () => {
    setPropertyValue(null);
    setPropertyType("urban");
    setCalculationResult(null);
  };

  const loadSavedCalculation = (calc: SavedCalculation) => {
    if (calc.type === "tenant") {
      setActiveTab("tenant");
      setVerdict(calc.data);
      setScenario(calc.data.scenario || "lockout");
      setStep("verdict");
    } else {
      setActiveTab("buyer");
      setCalculationResult(calc.data);
      setPropertyValue(calc.data.propertyValue);
      setPropertyType(calc.data.type);
    }
    closeHistory();
  };

  const handleDeleteCalculation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCalculation(id);
    refreshHistory();
    notifications.show({
      title: "Deleted",
      message: "Calculation removed from history",
      color: "orange",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatMoney = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const handleTenantPDFDownload = () => {
    try {
      generateTenantPDF(verdict, language);
      notifications.show({
        title: t.pdfGenerated,
        message: t.pdfDownloaded,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to generate PDF. Please try again.",
        color: "red",
      });
    }
  };

  const handleBuyerPDFDownload = () => {
    try {
      generateBuyerPDF(calculationResult, language);
      notifications.show({
        title: t.pdfGenerated,
        message: t.propertyReportDownloaded,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to generate PDF. Please try again.",
        color: "red",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'free_legal_aid': return 'green';
      case 'government': return 'blue';
      case 'police': return 'red';
      default: return 'gray';
    }
  };

  const filteredContacts = selectedCategory === 'all' 
    ? legalAidContacts 
    : legalAidContacts.filter(c => c.category === selectedCategory);

  const scenariosList = [
    { id: "lockout", name: t.scenario1, icon: IconDoor, color: "red" },
    { id: "utility_shutoff", name: t.scenario2, icon: IconBulb, color: "yellow" },
    { id: "harassment", name: t.scenario3, icon: IconMoodSad, color: "red" },
    { id: "deposit_dispute", name: t.scenario4, icon: IconCoin, color: "orange" },
    { id: "rent_increase", name: t.scenario5, icon: IconTrendingUp, color: "blue" },
    { id: "illegal_entry", name: t.scenario6, icon: IconDoor, color: "red" },
    { id: "retaliatory_eviction", name: t.scenario7, icon: IconTrendingUp, color: "red" },
    { id: "repairs_needed", name: t.scenario8, icon: IconBuildingCommunity, color: "orange" },
    { id: "noise_complaint", name: t.scenario9, icon: IconMoodSad, color: "yellow" },
    { id: "subletting_dispute", name: t.scenario10, icon: IconHome, color: "blue" },
    { id: "rent_receipt", name: t.scenario11, icon: IconCoin, color: "orange" },
    { id: "discrimination", name: t.scenario12, icon: IconShield, color: "red" },
    { id: "security_deposit", name: t.scenario13, icon: IconCoin, color: "yellow" },
    { id: "shared_utilities", name: t.scenario14, icon: IconBulb, color: "blue" },
    { id: "lease_termination", name: t.scenario15, icon: IconFileText, color: "orange" }
  ];

  const getAlertColor = (type: string) => {
    if (type === "error") return "red";
    if (type === "warning") return "yellow";
    return "green";
  };

  if (!isClient) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
        <Container size="sm" px={0}>
          <Paper p="xl" radius="lg" withBorder>
            <Group justify="center">
              <Loader size="lg" />
            </Group>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: isDark ? "#1a1a1a" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
      padding: isMobile ? "12px" : "20px",
      paddingBottom: isMobile ? "80px" : "20px"
    }}>
      <Container size="sm" px={0}>
        <Paper p={isMobile ? "md" : "xl"} radius="lg" style={{ background: isDark ? "#2d2d2d" : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)", color: "white", marginBottom: "16px" }}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={isMobile ? "md" : "xl"} radius="md" variant="light" color="white" style={{ background: "rgba(255,255,255,0.2)", minWidth: 40, minHeight: 40 }}>
                <IconScale size={isMobile ? 24 : 32} />
              </ThemeIcon>
              <div>
                <Title order={isMobile ? 3 : 2} style={{ color: "white", margin: 0, fontSize: isMobile ? "1.25rem" : "1.5rem" }}>
                  {t.title}
                </Title>
                {!isMobile && <Text size="sm" style={{ color: "rgba(255,255,255,0.8)" }}>{t.subtitle}</Text>}
              </div>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <Switch
                checked={isDark}
                onChange={toggleColorScheme}
                size="md"
                color="yellow"
                onLabel={<IconSun size={16} />}
                offLabel={<IconMoon size={16} />}
              />
              <OfflineStatus />
              {!isMobile ? (
                <>
                  <Button variant="subtle" color="white" size="sm" onClick={() => setShowLegalAid(true)}>
                    <IconPhone size={20} />
                  </Button>
                  <Button variant="subtle" color="white" size="sm" onClick={openHistory}>
                    <IconHistory size={20} />
                  </Button>
                  <Button variant="subtle" color="white" size="sm" onClick={() => shareApp()}>
                    <IconBrandWhatsapp size={20} />
                  </Button>
                </>
              ) : (
                <Button variant="subtle" color="white" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <IconMenu2 size={20} />
                </Button>
              )}
              <Select
                value={language}
                onChange={(val) => setLanguage(val as Language)}
                data={[
                  { value: "en", label: "EN" },
                  { value: "sw", label: "SW" },
                  { value: "sheng", label: "SH" }
                ]}
                size="xs"
                style={{ width: 70 }}
              />
            </Group>
          </Group>
        </Paper>

        <Modal opened={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} title={<Text fw={700}>📱 {t.menu}</Text>} fullScreen={isMobile} transitionProps={{ transition: 'slide-up' }}>
          <Stack gap="md">
            <Button size="lg" variant="light" leftSection={<IconPhone size={20} />} onClick={() => { setShowLegalAid(true); setMobileMenuOpen(false); }}>
              {t.legalAidTitle}
            </Button>
            <Button size="lg" variant="light" leftSection={<IconHistory size={20} />} onClick={() => { openHistory(); setMobileMenuOpen(false); }}>
              {t.history}
            </Button>
            <Button size="lg" variant="light" color="green" leftSection={<IconBrandWhatsapp size={20} />} onClick={() => { shareApp(); setMobileMenuOpen(false); }}>
              {t.shareApp}
            </Button>
          </Stack>
        </Modal>

        {!mobileMenuOpen && (
          <Tabs value={activeTab} onChange={setActiveTab} mb="md">
            <Tabs.List grow>
              <Tabs.Tab value="tenant" leftSection={<IconShield size={isMobile ? 16 : 18} />}>
                {isMobile ? "Tenant" : t.tenantMode}
              </Tabs.Tab>
              <Tabs.Tab value="buyer" leftSection={<IconHome size={isMobile ? 16 : 18} />}>
                {isMobile ? "Buyer" : t.buyerMode}
              </Tabs.Tab>
              <Tabs.Tab value="calculator" leftSection={<IconCalculator size={isMobile ? 16 : 18} />}>
                {isMobile ? "Rent" : t.calculatorMode}
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        )}

        {/* Tenant Flow */}
        {!mobileMenuOpen && activeTab === "tenant" && (
          <Paper p={isMobile ? "md" : "xl"} radius="lg" withBorder>
            {!verdict ? (
              <>
                {step === "scenarioSelect" && (
                  <>
                    <Title order={3} mb="md" size={isMobile ? "h4" : "h3"}>🔍 {t.scenarioTitle}</Title>
                    <ScrollArea h={400}>
                      <Stack gap="sm">
                        {scenariosList.map((s) => {
                          const Icon = s.icon;
                          return (
                            <Button
                              key={s.id}
                              variant="outline"
                              size="lg"
                              justify="start"
                              leftSection={<Icon size={isMobile ? 22 : 20} />}
                              onClick={() => handleScenarioSelect(s.id)}
                              style={{ minHeight: "56px", height: "auto", padding: "12px 16px" }}
                            >
                              <Text size={isMobile ? "md" : "sm"} fw={500}>{s.name}</Text>
                            </Button>
                          );
                        })}
                      </Stack>
                    </ScrollArea>
                  </>
                )}
                {step !== "scenarioSelect" && (
                  <>
                    <Title order={3} mb="lg" size={isMobile ? "h4" : "h3"}>{step === "question1" ? t.question1 : t.question2}</Title>
                    <Stack gap="sm">
                      {step === "question1" ? (
                        <>
                          <Button size="lg" variant="outline" justify="start" onClick={() => handleTenantAnswer("no")} style={{ minHeight: "56px", padding: "12px 16px", whiteSpace: "normal" }}>{t.option1}</Button>
                          <Button size="lg" variant="outline" justify="start" onClick={() => handleTenantAnswer("yes")} style={{ minHeight: "56px", padding: "12px 16px", whiteSpace: "normal" }}>{t.option2}</Button>
                        </>
                      ) : (
                        <>
                          <Button size="lg" variant="outline" justify="start" onClick={() => handleTenantAnswer("less")} style={{ minHeight: "56px", padding: "12px 16px" }}>{t.option3}</Button>
                          <Button size="lg" variant="outline" justify="start" onClick={() => handleTenantAnswer("more")} style={{ minHeight: "56px", padding: "12px 16px" }}>{t.option4}</Button>
                        </>
                      )}
                    </Stack>
                  </>
                )}
              </>
            ) : (
              <>
                <Alert title={verdict.type === "error" ? "Legal Violation Detected" : verdict.type === "warning" ? "Warning" : "Information"} color={getAlertColor(verdict.type)} icon={verdict.type === "error" ? <IconAlertTriangle /> : <IconShield />}>
                  <Text size="sm">{verdict.message}</Text>
                </Alert>
                <Space h="md" />
                <Button fullWidth size="lg" variant="filled" color="blue" leftSection={<IconDownload size={20} />} onClick={handleTenantPDFDownload} style={{ minHeight: "52px" }}>{t.download}</Button>
                <Space h="sm" />
                <Button fullWidth size="lg" variant="outline" color="green" leftSection={<IconBrandWhatsapp size={20} />} onClick={() => shareLegalNotice(verdict, language)} style={{ minHeight: "52px" }}>{t.shareWhatsApp}</Button>
                <Space h="sm" />
                <Button fullWidth size="lg" variant="light" leftSection={<IconRefresh size={20} />} onClick={resetTenantFlow} style={{ minHeight: "52px" }}>{t.startOver}</Button>
              </>
            )}
          </Paper>
        )}

        {/* Buyer Flow */}
        {!mobileMenuOpen && activeTab === "buyer" && (
          <Paper p={isMobile ? "md" : "xl"} radius="lg" withBorder>
            {!calculationResult ? (
              <>
                <Title order={3} mb="md">🏠 {t.propertyValue}</Title>
                <NumberInput
                  size="lg"
                  placeholder={t.propertyPlaceholder}
                  value={propertyValue === null ? undefined : propertyValue}
                  onChange={setPropertyValue}
                  thousandSeparator=","
                  min={0}
                  mb="lg"
                  styles={{ input: { minHeight: "52px", fontSize: "16px" } }}
                />
                <Title order={4} mb="sm">📍 {t.propertyType}</Title>
                <Radio.Group value={propertyType} onChange={setPropertyType} mb="lg">
                  <Stack gap="sm">
                    <Radio value="urban" label={t.urban} size="md" />
                    <Radio value="rural" label={t.rural} size="md" />
                  </Stack>
                </Radio.Group>
                <Button fullWidth size="lg" variant="filled" color="blue" onClick={calculateStampDuty} style={{ minHeight: "52px" }}>{t.calculate}</Button>
              </>
            ) : (
              <>
                <Card withBorder p="md" radius="md" mb="md" style={{ background: isDark ? "#2d2d2d" : "#f0f9ff" }}>
                  <Stack gap="sm">
                    <Group justify="space-between"><Text fw={500}>🏠 {t.propertyValue}:</Text><Text fw={700}>{formatMoney(calculationResult.propertyValue)}</Text></Group>
                    <Divider />
                    <Group justify="space-between"><Text fw={500}>📍 {t.propertyType}:</Text><Text>{calculationResult.type === "urban" ? t.urban : t.rural}</Text></Group>
                    <Divider />
                    <Group justify="space-between"><Text fw={500}>📊 {t.stampDuty} ({calculationResult.rate}%):</Text><Text fw={700} c="blue">{formatMoney(calculationResult.stampDuty)}</Text></Group>
                    <Divider />
                    <Group justify="space-between"><Text fw={500}>⚖️ {t.legalFees}:</Text><Text>{formatMoney(calculationResult.legalFees)}</Text></Group>
                    <Divider />
                    <Group justify="space-between" mt="sm"><Title order={4}>💰 {t.totalCost}:</Title><Title order={4} c="blue">{formatMoney(calculationResult.total)}</Title></Group>
                  </Stack>
                </Card>
                <Button fullWidth size="lg" variant="filled" color="blue" leftSection={<IconDownload size={20} />} onClick={handleBuyerPDFDownload} style={{ minHeight: "52px" }}>{t.download}</Button>
                <Space h="sm" />
                <Button fullWidth size="lg" variant="outline" color="green" leftSection={<IconBrandWhatsapp size={20} />} onClick={() => sharePropertyReport(calculationResult, language)} style={{ minHeight: "52px" }}>{t.shareWhatsApp}</Button>
                <Space h="sm" />
                <Button fullWidth size="lg" variant="light" onClick={clearCalculation} style={{ minHeight: "52px" }}>{t.calculateAnother}</Button>
              </>
            )}
          </Paper>
        )}

        {/* Rent Calculator */}
        {!mobileMenuOpen && activeTab === "calculator" && <RentCalculator language={language} t={t} />}

        {!mobileMenuOpen && (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Badge size="md" variant="light">⚖️ {activeTab === "tenant" ? t.tenantTag : activeTab === "buyer" ? t.buyerTag : t.calculatorMode}</Badge>
            <Text size="xs" c="dimmed" mt="md">© 2026 Mkaazi Navigator | Empowering Kenyan Citizens</Text>
          </div>
        )}

        <Modal opened={historyModalOpened} onClose={closeHistory} title={<Text fw={700} size="xl">📜 {t.history}</Text>} size="lg" fullScreen={isMobile} transitionProps={{ transition: isMobile ? 'slide-up' : 'fade' }}>
          {savedCalculations.length === 0 ? <Text c="dimmed" ta="center" py="xl">{t.noHistory}</Text> : (
            <ScrollArea h={isMobile ? "70vh" : 400}>
              <Stack gap="sm">
                {savedCalculations.map((calc) => (
                  <Paper key={calc.id} p="sm" withBorder onClick={() => loadSavedCalculation(calc)} style={{ cursor: "pointer" }}>
                    <Group justify="space-between">
                      <div><Group gap="xs" mb="xs"><Badge color={calc.type === "tenant" ? "blue" : "green"}>{calc.type === "tenant" ? t.tenantMode : t.buyerMode}</Badge><Text size="xs" c="dimmed">{t.savedOn}: {formatDate(calc.date)}</Text></Group><Text size="sm" lineClamp={2}>{calc.type === "tenant" ? calc.data.message.substring(0, 80) + "..." : `${t.propertyValue}: ${formatMoney(calc.data.propertyValue)}`}</Text></div>
                      <Button variant="subtle" color="red" size="sm" onClick={(e) => handleDeleteCalculation(calc.id, e)}><IconTrash size={18} /></Button>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>
          )}
          <Button fullWidth mt="md" onClick={closeHistory} size="lg">{t.backToHome}</Button>
        </Modal>

        <Modal opened={showLegalAid} onClose={() => setShowLegalAid(false)} title={<Text fw={700} size="xl">📞 {t.legalAidTitle}</Text>} size="xl" fullScreen={isMobile} transitionProps={{ transition: isMobile ? 'slide-up' : 'fade' }}>
          <Stack gap="md">
            <Group grow gap="xs">
              <Button variant={selectedCategory === 'all' ? 'filled' : 'light'} onClick={() => setSelectedCategory('all')} size={isMobile ? "sm" : "md"}>{t.allCategories}</Button>
              <Button variant={selectedCategory === 'free_legal_aid' ? 'filled' : 'light'} onClick={() => setSelectedCategory('free_legal_aid')} size={isMobile ? "sm" : "md"} color="green">{t.freeLegalAid}</Button>
              <Button variant={selectedCategory === 'government' ? 'filled' : 'light'} onClick={() => setSelectedCategory('government')} size={isMobile ? "sm" : "md"} color="blue">{t.government}</Button>
              <Button variant={selectedCategory === 'police' ? 'filled' : 'light'} onClick={() => setSelectedCategory('police')} size={isMobile ? "sm" : "md"} color="red">{t.emergency}</Button>
            </Group>
            <ScrollArea h={isMobile ? "65vh" : 500}>
              <Stack gap="md">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} withBorder p="sm">
                    <Group justify="space-between" align="start">
                      <div style={{ flex: 1 }}>
                        <Group gap="xs" mb="xs"><Badge color={getCategoryColor(contact.category)}>{contact.category === 'free_legal_aid' && t.freeLegalAid}{contact.category === 'government' && t.government}{contact.category === 'police' && t.emergency}</Badge><Text fw={700} size="md">{contact.name}</Text></Group>
                        <Text size="sm" c="dimmed" mb="xs">{contact.description[language]}</Text>
                        <Stack gap="xs" mt="md">
                          <Group gap="xs"><IconPhone size={16} /><Text size="sm"><a href={`tel:${contact.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>{contact.phone}</a>{contact.alternativePhone && ` / ${contact.alternativePhone}`}</Text></Group>
                          {contact.email && <Group gap="xs"><IconMail size={16} /><Text size="sm"><a href={`mailto:${contact.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{contact.email}</a></Text></Group>}
                          <Group gap="xs"><IconMapPin size={16} /><Text size="sm">{contact.location}</Text></Group>
                          {contact.hours && <Group gap="xs"><IconClock size={16} /><Text size="sm">{contact.hours}</Text></Group>}
                        </Stack>
                      </div>
                      <Button component="a" href={`tel:${contact.phone}`} color="green" size="sm" style={{ minWidth: "70px" }}>{t.call}</Button>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
          <Button fullWidth mt="md" onClick={() => setShowLegalAid(false)} size="lg">{t.backToHome}</Button>
        </Modal>

        <Modal opened={comingSoonOpened} onClose={closeComingSoon} title={<Text fw={700} size="xl">❤️ {t.comingSoon}</Text>} fullScreen={isMobile} transitionProps={{ transition: isMobile ? 'slide-up' : 'fade' }}>
          <Text>{t.comingSoonDesc}</Text>
          <Space h="md" />
          <Text size="sm" c="dimmed">{t.localStorageNote}</Text>
          <Button fullWidth mt="lg" onClick={closeComingSoon} size="lg">{t.gotIt}</Button>
        </Modal>

        <SOSButton language={language} t={t} />
        <InstallPrompt />
      </Container>
    </div>
  );
}