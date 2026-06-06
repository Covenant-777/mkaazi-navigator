import jsPDF from 'jspdf';

interface TenantPDFData {
  message: string;
  type: string;
  scenario?: string;
}

interface BuyerPDFData {
  propertyValue: number;
  type: string;
  rate: number;
  stampDuty: number;
  legalFees: number;
  total: number;
}

export const generateTenantPDF = (data: TenantPDFData, language: string) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString();
  const refNumber = `MKAAZI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  const translations: Record<string, any> = {
    en: {
      title: 'MKAAZI NAVIGATOR - LEGAL NOTICE',
      issuedBy: 'Mkaazi Navigator Legal Aid',
      ref: 'Reference Number',
      date: 'Date Issued',
      legalNotice: 'LEGAL NOTICE',
      violation: 'Legal Violation Detected',
      recommendation: 'Recommended Actions',
      action1: 'Document all communication with your landlord',
      action2: 'Take photos/videos as evidence',
      action3: 'Report to the nearest police station',
      action4: 'Contact the Rent Restriction Tribunal',
      action5: 'Seek free legal aid from Kituo cha Sheria',
      footer: 'Mkaazi Navigator - Empowering Kenyan Citizens',
      disclaimer: 'This is an AI-generated legal guidance document. For complex cases, please consult a licensed Kenyan advocate.'
    },
    sw: {
      title: 'MKAAZI NAVIGATOR - NOTISI YA KISHERIA',
      issuedBy: 'Msaada wa Kisheria wa Mkaazi Navigator',
      ref: 'Namba ya Kumbukumbu',
      date: 'Tarehe Iliyotolewa',
      legalNotice: 'NOTISI YA KISHERIA',
      violation: 'Ukiukaji wa Sheria Umegunduliwa',
      recommendation: 'Hatua Zinazopendekezwa',
      action1: 'Andika mawasiliano yote na mwenye nyumba',
      action2: 'Piga picha/video kama ushahidi',
      action3: 'Ripoti kwa kituo cha karibu cha polisi',
      action4: 'Wasiliana na Mahakama ya Kukodisha',
      action5: 'Tafuta msaada wa kisheria bure kutoka Kituo cha Sheria',
      footer: 'Mkaazi Navigator - Kuwapa Nguvu Wananchi wa Kenya',
      disclaimer: 'Hii ni hati ya mwongozo wa kisheria iliyotengenezwa na AI. Kwa kesi ngumu, tafuta wakili aliyeidhinishwa wa Kenya.'
    },
    sheng: {
      title: 'MKAAZI NAVIGATOR - LEGAL NOTICE',
      issuedBy: 'Mkaazi Navigator Legal Aid',
      ref: 'Reference Number',
      date: 'Date Issued',
      legalNotice: 'LEGAL NOTICE',
      violation: 'Legal Violation Detected',
      recommendation: 'Recommended Actions',
      action1: 'Document all communication with landlord',
      action2: 'Take photos/videos as evidence',
      action3: 'Report to nearest police station',
      action4: 'Contact Rent Restriction Tribunal',
      action5: 'Seek free legal aid from Kituo cha Sheria',
      footer: 'Mkaazi Navigator - Empowering Kenyan Citizens',
      disclaimer: 'Hii ni AI-generated legal guidance. For complex cases, consult licensed Kenyan advocate.'
    }
  };
  
  const t = translations[language] || translations.en;
  
  // Set font
  doc.setFont('helvetica');
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(102, 126, 234);
  doc.text(t.title, 105, 20, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(t.issuedBy, 105, 30, { align: 'center' });
  
  // Reference and Date
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`${t.ref}: ${refNumber}`, 20, 45);
  doc.text(`${t.date}: ${currentDate}`, 20, 52);
  
  // Separator line
  doc.setDrawColor(102, 126, 234);
  doc.line(20, 58, 190, 58);
  
  // Violation Section
  doc.setFontSize(14);
  doc.setTextColor(220, 53, 69);
  doc.text(t.violation, 20, 70);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  // Split long message into multiple lines
  const splitMessage = doc.splitTextToSize(data.message, 170);
  doc.text(splitMessage, 20, 80);
  
  // Recommended Actions
  let yPos = 80 + (splitMessage.length * 7);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(t.recommendation, 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`• ${t.action1}`, 25, yPos);
  yPos += 7;
  doc.text(`• ${t.action2}`, 25, yPos);
  yPos += 7;
  doc.text(`• ${t.action3}`, 25, yPos);
  yPos += 7;
  doc.text(`• ${t.action4}`, 25, yPos);
  yPos += 7;
  doc.text(`• ${t.action5}`, 25, yPos);
  
  // Disclaimer Box
  yPos += 15;
  doc.setFillColor(255, 243, 205);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const splitDisclaimer = doc.splitTextToSize(t.disclaimer, 160);
  doc.text(splitDisclaimer, 30, yPos);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(t.footer, 105, 280, { align: 'center' });
  
  // Save the PDF
  doc.save(`mkaazi_legal_notice_${Date.now()}.pdf`);
};

export const generateBuyerPDF = (data: BuyerPDFData, language: string) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString();
  const refNumber = `MKAAZI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  const translations: Record<string, any> = {
    en: {
      title: 'MKAAZI NAVIGATOR - PROPERTY REPORT',
      issuedBy: 'Mkaazi Navigator Property Calculator',
      ref: 'Report Number',
      date: 'Date Issued',
      propertyDetails: 'Property Details',
      costBreakdown: 'Cost Breakdown',
      stampDuty: 'Stamp Duty',
      legalFees: 'Legal Fees (Estimated)',
      totalCost: 'Total Estimated Cost',
      nextSteps: 'Recommended Next Steps',
      step1: 'Verify land title at ArdhiSasa',
      step2: 'Conduct due diligence with local authorities',
      step3: 'Engage a licensed advocate',
      step4: 'Sign sale agreement after verification',
      footer: 'Mkaazi Navigator - Empowering Kenyan Citizens',
      disclaimer: 'This is an estimate. Actual fees may vary. Always verify with ArdhiSasa.'
    },
    sw: {
      title: 'MKAAZI NAVIGATOR - RIPOTI YA NYUMBA',
      issuedBy: 'Kikokotozi cha Nyumba cha Mkaazi Navigator',
      ref: 'Namba ya Ripoti',
      date: 'Tarehe Iliyotolewa',
      propertyDetails: 'Maelezo ya Nyumba',
      costBreakdown: 'Uchambuzi wa Gharama',
      stampDuty: 'Stamp Duty',
      legalFees: 'Ada ya Kisheria (Makadirio)',
      totalCost: 'Jumla ya Gharama Makadirio',
      nextSteps: 'Hatua Zinazofuata Zinazopendekezwa',
      step1: 'Thibitisha hati ya ardhi kwenye ArdhiSasa',
      step2: 'Fanya utafiti wa kina na mamlaka za mitaa',
      step3: 'Wasiliana na wakili aliyeidhinishwa',
      step4: 'Saini makubaliano ya uuzaji baada ya uthibitisho',
      footer: 'Mkaazi Navigator - Kuwapa Nguvu Wananchi wa Kenya',
      disclaimer: 'Hii ni makadirio. Ada halisi zinaweza kutofautiana. Thibitisha kwenye ArdhiSasa.'
    },
    sheng: {
      title: 'MKAAZI NAVIGATOR - PROPERTY REPORT',
      issuedBy: 'Mkaazi Navigator Property Calculator',
      ref: 'Report Number',
      date: 'Date Issued',
      propertyDetails: 'Property Details',
      costBreakdown: 'Cost Breakdown',
      stampDuty: 'Stamp Duty',
      legalFees: 'Legal Fees (Estimated)',
      totalCost: 'Total Estimated Cost',
      nextSteps: 'Recommended Next Steps',
      step1: 'Verify land title at ArdhiSasa',
      step2: 'Conduct due diligence with local authorities',
      step3: 'Engage licensed advocate',
      step4: 'Sign sale agreement after verification',
      footer: 'Mkaazi Navigator - Empowering Kenyan Citizens',
      disclaimer: 'Hii ni estimate. Actual fees may differ. Check ArdhiSasa for confirmation.'
    }
  };
  
  const t = translations[language] || translations.en;
  
  // Set font
  doc.setFont('helvetica');
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(102, 126, 234);
  doc.text(t.title, 105, 20, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(t.issuedBy, 105, 30, { align: 'center' });
  
  // Reference and Date
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`${t.ref}: ${refNumber}`, 20, 45);
  doc.text(`${t.date}: ${currentDate}`, 20, 52);
  
  // Separator line
  doc.setDrawColor(102, 126, 234);
  doc.line(20, 58, 190, 58);
  
  // Property Details
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(t.propertyDetails, 20, 70);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Property Value: KES ${data.propertyValue.toLocaleString()}`, 25, 82);
  doc.text(`Property Type: ${data.type === 'urban' ? 'Urban (City/Municipality)' : 'Rural (Agricultural Land)'}`, 25, 92);
  
  // Cost Breakdown
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(t.costBreakdown, 20, 110);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`${t.stampDuty} (${data.rate}%): KES ${data.stampDuty.toLocaleString()}`, 25, 122);
  doc.text(`${t.legalFees}: KES ${data.legalFees.toLocaleString()}`, 25, 132);
  
  // Total
  doc.setFontSize(13);
  doc.setTextColor(102, 126, 234);
  doc.text(`${t.totalCost}: KES ${data.total.toLocaleString()}`, 25, 148);
  
  // Next Steps
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(t.nextSteps, 20, 165);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`1. ${t.step1}`, 25, 177);
  doc.text(`2. ${t.step2}`, 25, 187);
  doc.text(`3. ${t.step3}`, 25, 197);
  doc.text(`4. ${t.step4}`, 25, 207);
  
  // Disclaimer Box
  doc.setFillColor(220, 249, 250);
  doc.rect(20, 215, 170, 25, 'F');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const splitDisclaimer = doc.splitTextToSize(t.disclaimer, 160);
  doc.text(splitDisclaimer, 30, 225);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(t.footer, 105, 280, { align: 'center' });
  
  // Save the PDF
  doc.save(`mkaazi_property_report_${Date.now()}.pdf`);
};
