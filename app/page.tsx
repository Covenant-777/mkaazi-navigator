"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LegalPDF } from "@/components/LegalPDF";
import { saveCalculation, getSavedCalculations, deleteCalculation, clearAllCalculations, SavedCalculation } from "@/lib/storage";

type Language = 'en' | 'sw' | 'sheng';

const translations: Record<Language, any> = {
  en: {
    title: "Mkaazi Navigator",
    tenantMode: "Tenant Protection",
    buyerMode: "Property Buyer",
    savedHistory: "Saved History",
    history: "History",
    clearHistory: "Clear All",
    noHistory: "No saved calculations yet",
    scenario1: "Illegal Lockout / Eviction",
    scenario2: "Illegal Utility Shutoff",
    scenario3: "Harassment by Landlord",
    scenario4: "Deposit Refund Dispute",
    scenario5: "Unlawful Rent Increase",
    scenarioTitle: "Select Your Situation",
    question1: "Has your landlord issued a formal written eviction notice?",
    option1: "No, they locked me out without notice",
    option2: "Yes, I received a written notice",
    question2: "How many days notice did the letter specify?",
    option3: "Less than 30 days",
    option4: "30 days or more",
    verdict_illegal_lockout: "⚠️ ILLEGAL LOCKOUT! Your landlord cannot lock you out without a court order and 30 days written notice. This is a criminal offense under Kenyan law.",
    verdict_illegal_notice: "⚠️ INVALID NOTICE! The Landlord & Tenant Act requires minimum 30 days written notice.",
    verdict_valid_notice: "✓ Valid notice period. Your landlord followed the legal requirement.",
    verdict_utility_shutoff: "⚠️ ILLEGAL UTILITY SHUTOFF! Landlords cannot shut off water or electricity to force eviction.",
    verdict_harassment: "⚠️ LANDLORD HARASSMENT! Threats and intimidation violate Section 41 of the Landlord & Tenant Act.",
    verdict_deposit_dispute: "⚠️ DEPOSIT DISPUTE! Landlords must return deposits within 30 days or provide written reasons for deductions.",
    verdict_rent_increase: "⚠️ UNLAWFUL RENT INCREASE! Rent cannot be increased without proper notice (minimum 30 days).",
    download: "Download Legal Notice (PDF)",
    startOver: "Start Over",
    generating: "Generating PDF...",
    propertyValue: "Property Value (KES)",
    propertyValuePlaceholder: "e.g., 5000000",
    propertyType: "Property Location",
    urban: "Urban (City/Municipality) - 4%",
    rural: "Rural (Agricultural Land) - 2%",
    calculate: "Calculate Stamp Duty",
    stampDutyResult: "Stamp Duty Payable",
    legalFee: "Estimated Legal Fees (2%)",
    totalCost: "Total Estimated Cost",
    clear: "Clear",
    note: "Note: This is an estimate. Always verify with ArdhiSasa.",
    calculateAnother: "Calculate Another Property",
    savedFrom: "Saved on",
    view: "View",
    delete: "Delete",
    recalculate: "Recalculate"
  },
  sw: {
    title: "Mkaazi Navigator",
    tenantMode: "Ulinzi wa Mpangaji",
    buyerMode: "Mnunuzi wa Nyumba",
    savedHistory: "Historia Iliyohifadhiwa",
    history: "Historia",
    clearHistory: "Futa Historia",
    noHistory: "Hakuna hesabu zilizohifadhiwa bado",
    scenario1: "Kufungiwa nje / Kufukuzwa Bila Halal",
    scenario2: "Kukatwa Huduma Bila Halal",
    scenario3: "Dhuluma kutoka kwa Mwenye Nyumba",
    scenario4: "Mzozo wa Kurejesha Amani",
    scenario5: "Ongezeko la Kodi Bila Halal",
    scenarioTitle: "Chagua Hali Yako",
    question1: "Je, mwenye nyumba amekupa ilani rasmi ya maandishi?",
    option1: "Hapana, alinifungia mlango bila ilani",
    option2: "Ndio, nilipata ilani ya maandishi",
    question2: "Ilani ilitaja siku ngapi?",
    option3: "Chini ya siku 30",
    option4: "Siku 30 au zaidi",
    verdict_illegal_lockout: "⚠️ KUFUNGWA BILA HALAL! Mwenye nyumba hawezi kukufungia nje bila amri ya mahakama na ilani ya siku 30.",
    verdict_illegal_notice: "⚠️ ILANI BATILI! Sheria inahitaji ilani ya siku 30.",
    verdict_valid_notice: "✓ Ilani sahihi. Mwenye nyumba amefuata sheria.",
    verdict_utility_shutoff: "⚠️ KUKATWA HUDUMA BILA HALAL! Mwenye nyumba hawezi kukata maji au umeme.",
    verdict_harassment: "⚠️ DHULUMA YA MWENYE NYUMBA! Vitisho na vitendo vya kukusumbua ni kosa.",
    verdict_deposit_dispute: "⚠️ MZOGO WA AMANA! Mwenye nyumba lazima arejeshe amana ndani ya siku 30.",
    verdict_rent_increase: "⚠️ ONGEZEKO LA KODI BILA HALAL! Kodi haiwezi kuongezwa bila ilani sahihi.",
    download: "Pakua Notisi ya Kisheria (PDF)",
    startOver: "Anza Upya",
    generating: "Inaunda PDF...",
    propertyValue: "Thamani ya Nyumba/Kiwanja (KES)",
    propertyValuePlaceholder: "mfano: 5000000",
    propertyType: "Eneo la Nyumba/Kiwanja",
    urban: "Mjini (Jiji/Municipality) - 4%",
    rural: "Vijijini (Ardhi ya Kilimo) - 2%",
    calculate: "Kokotoa Stamp Duty",
    stampDutyResult: "Stamp Duty Inayolipwa",
    legalFee: "Ada ya Kisheria Inayokadiriwa (2%)",
    totalCost: "Jumla ya Gharama",
    clear: "Futa",
    note: "Kumbuka: Hii ni makadirio. Thibitisha kwenye ArdhiSasa.",
    calculateAnother: "Kokotoa Kiwanja Kingine",
    savedFrom: "Ilihifadhiwa",
    view: "Angalia",
    delete: "Futa",
    recalculate: "Kokotoa Tena"
  },
  sheng: {
    title: "Mkaazi Navigator",
    tenantMode: "Tenant Protection",
    buyerMode: "Property Buyer",
    savedHistory: "Saved History",
    history: "History",
    clearHistory: "Clear All",
    noHistory: "No saved calculations yet",
    scenario1: "Illegal Lockout / Eviction",
    scenario2: "Illegal Utility Shutoff",
    scenario3: "Harassment by Landlord",
    scenario4: "Deposit Refund Dispute",
    scenario5: "Unlawful Rent Increase",
    scenarioTitle: "Select Your Situation",
    question1: "Landlord amekuchorea notice yoyote ya maandishi?",
    option1: "Zii, ameweka tu kufuli bila kuniambia",
    option2: "Eeh, ameshia na barua",
    question2: "Hiyo barua inasema uondoke baada ya siku ngapi?",
    option3: "Chini ya mwezi mmoja",
    option4: "Mwezi mmoja ama zaidi",
    verdict_illegal_lockout: "⚠️ ILLEGAL LOCKOUT! Landlord hawezi kukuwekea kufuli bila court order.",
    verdict_illegal_notice: "⚠️ NOTICE INVALID! Sheria inataka mwezi mmoja notice.",
    verdict_valid_notice: "✓ Notice ni sahihi. Landlord amefuata sheria.",
    verdict_utility_shutoff: "⚠️ ILLEGAL UTILITY SHUTOFF! Landlord hawezi kukata water au electricity.",
    verdict_harassment: "⚠️ LANDLORD HARASSMENT! Threats na intimidation ni violation.",
    verdict_deposit_dispute: "⚠️ DEPOSIT DISPUTE! Landlord must return deposit within 30 days.",
    verdict_rent_increase: "⚠️ UNLAWFUL RENT INCREASE! Rent cannot increase without proper notice.",
    download: "Download Legal Notice (PDF)",
    startOver: "Start Over",
    generating: "Generating PDF...",
    propertyValue: "Property Value (KES)",
    propertyValuePlaceholder: "e.g., 5000000",
    propertyType: "Property Location",
    urban: "Urban (City/Municipality) - 4%",
    rural: "Rural (Agricultural Land) - 2%",
    calculate: "Calculate Stamp Duty",
    stampDutyResult: "Stamp Duty Payable",
    legalFee: "Estimated Legal Fees (2%)",
    totalCost: "Total Estimated Cost",
    clear: "Clear",
    note: "Note: Hii ni estimate tu. Check ArdhiSasa for confirmation.",
    calculateAnother: "Calculate Another Property",
    savedFrom: "Saved on",
    view: "View",
    delete: "Delete",
    recalculate: "Recalculate"
  }
};

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "20px" },
  header: { background: "white", borderRadius: "16px", padding: "20px", marginBottom: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  logoIcon: { fontSize: "32px" },
  logoText: { fontSize: "24px", fontWeight: "bold", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", color: "transparent" },
  tabContainer: { display: "flex", gap: "10px", marginBottom: "10px" },
  tab: { flex: 1, padding: "12px", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s" },
  tabActive: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" },
  tabInactive: { background: "#f3f4f6", color: "#4b5563" },
  select: { padding: "8px 12px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "white", cursor: "pointer", marginTop: "10px" },
  card: { background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "20px" },
  question: { fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: "#1a202c" },
  button: { width: "100%", padding: "16px", marginBottom: "12px", border: "2px solid #e2e8f0", borderRadius: "12px", background: "white", fontSize: "16px", textAlign: "left" as const, cursor: "pointer", transition: "all 0.3s" },
  input: { width: "100%", padding: "16px", marginBottom: "20px", border: "2px solid #e2e8f0", borderRadius: "12px", fontSize: "16px", boxSizing: "border-box" as const },
  radioGroup: { marginBottom: "20px" },
  radioLabel: { display: "flex", alignItems: "center", padding: "12px", marginBottom: "8px", border: "2px solid #e2e8f0", borderRadius: "12px", cursor: "pointer" },
  radio: { marginRight: "12px", width: "18px", height: "18px" },
  resultCard: { background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)", borderRadius: "12px", padding: "20px", marginBottom: "20px" },
  resultRow: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #e2e8f0" },
  resultLabel: { fontWeight: "600", color: "#4a5568" },
  resultValue: { fontWeight: "700", color: "#2d3748" },
  totalRow: { display: "flex", justifyContent: "space-between", padding: "16px 0 0 0", marginTop: "8px", fontWeight: "800", fontSize: "18px" },
  note: { fontSize: "12px", color: "#718096", marginTop: "16px", fontStyle: "italic" },
  btnPrimary: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "12px" },
  btnSecondary: { width: "100%", padding: "16px", background: "white", color: "#4a5568", border: "2px solid #e2e8f0", borderRadius: "12px", fontSize: "16px", cursor: "pointer" },
  footer: { textAlign: "center" as const, color: "white", fontSize: "12px", marginTop: "32px" },
  alertDanger: { padding: "16px", borderRadius: "12px", marginBottom: "20px", background: "#fed7d7", borderLeft: "4px solid #e53e3e", color: "#742a2a" },
  alertWarning: { padding: "16px", borderRadius: "12px", marginBottom: "20px", background: "#feebc8", borderLeft: "4px solid #ed8936", color: "#7b341e" },
  alertSuccess: { padding: "16px", borderRadius: "12px", marginBottom: "20px", background: "#c6f6d5", borderLeft: "4px solid #38a169", color: "#22543d" },
  historyItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #e2e8f0", cursor: "pointer" },
  historyItemHover: { background: "#f9fafb" },
  historyType: { padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  historyTenant: { background: "#fee2e2", color: "#991b1b" },
  historyBuyer: { background: "#dbeafe", color: "#1e40af" },
  buttonSmall: { padding: "6px 12px", fontSize: "12px", marginLeft: "8px", border: "none", borderRadius: "6px", cursor: "pointer" }
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("tenant");
  const [showHistory, setShowHistory] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  
  const [scenario, setScenario] = useState<string | null>(null);
  const [step, setStep] = useState("scenarioSelect");
  const [verdict, setVerdict] = useState<any>(null);
  
  const [propertyValue, setPropertyValue] = useState("");
  const [propertyType, setPropertyType] = useState("urban");
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const t = translations[language];

  useEffect(() => {
    setSavedCalculations(getSavedCalculations());
  }, []);

  const refreshHistory = () => {
    setSavedCalculations(getSavedCalculations());
  };

  const handleScenarioSelect = (selectedScenario: string) => {
    setScenario(selectedScenario);
    setStep("question1");
  };

  const handleTenantAnswer = (answer: string) => {
    if (step === "question1") {
      if (answer === "no") {
        const verdictData = { type: "danger", message: t.verdict_illegal_lockout, scenario };
        setVerdict(verdictData);
        saveCalculation("tenant", verdictData, language);
        refreshHistory();
      } else {
        setStep("question2");
      }
    } else if (step === "question2") {
      let verdictData;
      if (answer === "less") {
        verdictData = { type: "warning", message: t.verdict_illegal_notice, scenario };
      } else {
        verdictData = { type: "success", message: t.verdict_valid_notice, scenario };
      }
      
      if (scenario === "utility_shutoff") {
        verdictData = { type: "danger", message: t.verdict_utility_shutoff, scenario };
      } else if (scenario === "harassment") {
        verdictData = { type: "danger", message: t.verdict_harassment, scenario };
      } else if (scenario === "deposit_dispute") {
        verdictData = { type: "warning", message: t.verdict_deposit_dispute, scenario };
      } else if (scenario === "rent_increase") {
        verdictData = { type: "warning", message: t.verdict_rent_increase, scenario };
      }
      
      setVerdict(verdictData);
      saveCalculation("tenant", verdictData, language);
      refreshHistory();
    }
  };

  const resetTenantFlow = () => {
    setScenario(null);
    setStep("scenarioSelect");
    setVerdict(null);
  };

  const calculateStampDuty = () => {
    const value = parseFloat(propertyValue);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid property value");
      return;
    }
    
    const rate = propertyType === "urban" ? 0.04 : 0.02;
    const stampDuty = value * rate;
    const legalFees = value * 0.02;
    const total = stampDuty + legalFees;
    
    const result = {
      stampDuty,
      legalFees,
      total,
      rate: rate * 100,
      type: propertyType,
      propertyValue: value
    };
    
    setCalculationResult(result);
    saveCalculation("buyer", result, language);
    refreshHistory();
  };
  
  const clearCalculation = () => {
    setPropertyValue("");
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
      setPropertyValue(calc.data.propertyValue.toString());
      setPropertyType(calc.data.type);
    }
    setShowHistory(false);
  };

  const handleDeleteCalculation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCalculation(id);
    refreshHistory();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatMoney = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const scenarios = [
    { id: "lockout", name: t.scenario1, icon: "🚪" },
    { id: "utility_shutoff", name: t.scenario2, icon: "💡" },
    { id: "harassment", name: t.scenario3, icon: "😤" },
    { id: "deposit_dispute", name: t.scenario4, icon: "💰" },
    { id: "rent_increase", name: t.scenario5, icon: "📈" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚖️</span>
            <span style={styles.logoText}>{t.title}</span>
          </div>
          
          <div style={styles.tabContainer}>
            <button style={{ ...styles.tab, ...(activeTab === "tenant" ? styles.tabActive : styles.tabInactive) }} onClick={() => { setActiveTab("tenant"); setShowHistory(false); }}>
              {t.tenantMode}
            </button>
            <button style={{ ...styles.tab, ...(activeTab === "buyer" ? styles.tabActive : styles.tabInactive) }} onClick={() => { setActiveTab("buyer"); setShowHistory(false); }}>
              {t.buyerMode}
            </button>
            <button style={{ ...styles.tab, ...(showHistory ? styles.tabActive : styles.tabInactive) }} onClick={() => setShowHistory(!showHistory)}>
              📜 {t.history}
            </button>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <select style={styles.select} value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">English 🇬🇧</option>
              <option value="sw">Kiswahili 🇰🇪</option>
              <option value="sheng">Sheng 🏙️</option>
            </select>
            {showHistory && savedCalculations.length > 0 && (
              <button style={styles.buttonSmall} onClick={() => { clearAllCalculations(); refreshHistory(); }}>
                {t.clearHistory}
              </button>
            )}
          </div>
        </div>

        {showHistory ? (
          <div style={styles.card}>
            <div style={styles.question}>📜 {t.savedHistory}</div>
            {savedCalculations.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>{t.noHistory}</p>
            ) : (
              savedCalculations.map((calc) => (
                <div key={calc.id} style={styles.historyItem} onClick={() => loadSavedCalculation(calc)}>
                  <div style={{ flex: 1 }}>
                    <span style={{ ...styles.historyType, ...(calc.type === "tenant" ? styles.historyTenant : styles.historyBuyer) }}>
                      {calc.type === "tenant" ? t.tenantMode : t.buyerMode}
                    </span>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      {t.savedFrom}: {formatDate(calc.date)}
                    </div>
                  </div>
                  <button style={{ ...styles.buttonSmall, background: "#ef4444", color: "white" }} onClick={(e) => handleDeleteCalculation(calc.id, e)}>
                    {t.delete}
                  </button>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "tenant" ? (
          !verdict ? (
            <>
              {step === "scenarioSelect" && (
                <div style={styles.card}>
                  <div style={styles.question}>🔍 {t.scenarioTitle}</div>
                  {scenarios.map((s) => (
                    <button key={s.id} style={styles.button} onClick={() => handleScenarioSelect(s.id)}>
                      {s.icon} {s.name}
                    </button>
                  ))}
                </div>
              )}
              
              {step !== "scenarioSelect" && (
                <div style={styles.card}>
                  <div style={styles.question}>
                    {step === "question1" ? t.question1 : t.question2}
                  </div>
                  {step === "question1" ? (
                    <>
                      <button style={styles.button} onClick={() => handleTenantAnswer("no")}>{t.option1}</button>
                      <button style={styles.button} onClick={() => handleTenantAnswer("yes")}>{t.option2}</button>
                    </>
                  ) : (
                    <>
                      <button style={styles.button} onClick={() => handleTenantAnswer("less")}>{t.option3}</button>
                      <button style={styles.button} onClick={() => handleTenantAnswer("more")}>{t.option4}</button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={styles.card}>
              <div style={verdict.type === "danger" ? styles.alertDanger : verdict.type === "warning" ? styles.alertWarning : styles.alertSuccess}>
                {verdict.message}
              </div>
              
              <PDFDownloadLink
                document={<LegalPDF type="tenant" data={verdict} language={language} />}
                fileName={`mkaazi_legal_notice_${Date.now()}.pdf`}
              >
                {({ loading }) => (
                  <button style={styles.btnPrimary} disabled={loading}>
                    {loading ? t.generating : t.download}
                  </button>
                )}
              </PDFDownloadLink>
              
              <button style={styles.btnSecondary} onClick={resetTenantFlow}>{t.startOver}</button>
            </div>
          )
        ) : (
          !calculationResult ? (
            <div style={styles.card}>
              <div style={styles.question}>🏠 {t.propertyValue}</div>
              <input
                type="number"
                style={styles.input}
                placeholder={t.propertyValuePlaceholder}
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
              />
              
              <div style={styles.question}>📍 {t.propertyType}</div>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input type="radio" style={styles.radio} value="urban" checked={propertyType === "urban"} onChange={(e) => setPropertyType(e.target.value)} />
                  {t.urban}
                </label>
                <label style={styles.radioLabel}>
                  <input type="radio" style={styles.radio} value="rural" checked={propertyType === "rural"} onChange={(e) => setPropertyType(e.target.value)} />
                  {t.rural}
                </label>
              </div>
              
              <button style={styles.btnPrimary} onClick={calculateStampDuty}>{t.calculate}</button>
            </div>
          ) : (
            <div style={styles.card}>
              <div style={styles.resultCard}>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>🏠 {t.propertyValue}:</span>
                  <span style={styles.resultValue}>{formatMoney(calculationResult.propertyValue)}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>📍 {t.propertyType}:</span>
                  <span style={styles.resultValue}>{calculationResult.type === "urban" ? t.urban : t.rural}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>📊 {t.stampDutyResult} ({calculationResult.rate}%):</span>
                  <span style={styles.resultValue}>{formatMoney(calculationResult.stampDuty)}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>⚖️ {t.legalFee}:</span>
                  <span style={styles.resultValue}>{formatMoney(calculationResult.legalFees)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>💰 {t.totalCost}:</span>
                  <span style={{ color: "#667eea" }}>{formatMoney(calculationResult.total)}</span>
                </div>
              </div>
              
              <PDFDownloadLink
                document={<LegalPDF type="buyer" data={calculationResult} language={language} />}
                fileName={`mkaazi_property_report_${Date.now()}.pdf`}
              >
                {({ loading }) => (
                  <button style={styles.btnPrimary} disabled={loading}>
                    {loading ? t.generating : t.download}
                  </button>
                )}
              </PDFDownloadLink>
              
              <button style={styles.btnSecondary} onClick={clearCalculation}>{t.calculateAnother}</button>
            </div>
          )
        )}

        <div style={styles.footer}>
          <p>⚖️ Powered by Mkaazi Navigator | {activeTab === "tenant" ? "Legal guidance for Kenyan tenants" : "Property buying assistance for Kenyans"}</p>
        </div>
      </div>
    </div>
  );
}