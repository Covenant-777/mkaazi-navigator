export const shareViaWhatsApp = (text: string, isPDF: boolean = false) => {
  // Encode the text for URL
  const encodedText = encodeURIComponent(text);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank');
};

export const shareLegalNotice = (verdict: any, language: string) => {
  const currentDate = new Date().toLocaleDateString();
  
  let shareText = '';
  
  if (language === 'en') {
    shareText = `⚖️ MKAAZI NAVIGATOR - LEGAL NOTICE

${verdict.message}

Date: ${currentDate}
Case Ref: MKAAZI-${Date.now()}

Download Mkaazi Navigator for legal help: [Your App URL]`;
  } else if (language === 'sw') {
    shareText = `⚖️ MKAAZI NAVIGATOR - NOTISI YA KISHERIA

${verdict.message}

Tarehe: ${currentDate}
Rejea: MKAAZI-${Date.now()}

Pakua Mkaazi Navigator kwa msaada wa kisheria: [Your App URL]`;
  } else {
    shareText = `⚖️ MKAAZI NAVIGATOR - LEGAL NOTICE

${verdict.message}

Date: ${currentDate}
Case Ref: MKAAZI-${Date.now()}

Download Mkaazi Navigator for legal help: [Your App URL]`;
  }
  
  shareViaWhatsApp(shareText);
};

export const sharePropertyReport = (result: any, language: string) => {
  const currentDate = new Date().toLocaleDateString();
  
  let shareText = '';
  
  if (language === 'en') {
    shareText = `🏠 MKAAZI NAVIGATOR - PROPERTY REPORT

Property Value: KES ${result.propertyValue.toLocaleString()}
Property Type: ${result.type === 'urban' ? 'Urban (City/Municipality)' : 'Rural (Agricultural Land)'}
Stamp Duty (${result.rate}%): KES ${result.stampDuty.toLocaleString()}
Legal Fees (2%): KES ${result.legalFees.toLocaleString()}
TOTAL COST: KES ${result.total.toLocaleString()}

Date: ${currentDate}
Report Ref: MKAAZI-${Date.now()}

Download Mkaazi Navigator for property calculations: [Your App URL]`;
  } else if (language === 'sw') {
    shareText = `🏠 MKAAZI NAVIGATOR - RIPOTI YA NYUMBA

Thamani ya Nyumba: KES ${result.propertyValue.toLocaleString()}
Aina ya Nyumba: ${result.type === 'urban' ? 'Mjini (Jiji)' : 'Vijijini (Ardhi)'}
Stamp Duty (${result.rate}%): KES ${result.stampDuty.toLocaleString()}
Ada ya Kisheria (2%): KES ${result.legalFees.toLocaleString()}
JUMLA YA GHARAMA: KES ${result.total.toLocaleString()}

Tarehe: ${currentDate}
Rejea ya Ripoti: MKAAZI-${Date.now()}

Pakua Mkaazi Navigator kwa hesabu za nyumba: [Your App URL]`;
  } else {
    shareText = `🏠 MKAAZI NAVIGATOR - PROPERTY REPORT

Property Value: KES ${result.propertyValue.toLocaleString()}
Property Type: ${result.type === 'urban' ? 'Urban' : 'Rural'}
Stamp Duty (${result.rate}%): KES ${result.stampDuty.toLocaleString()}
Legal Fees: KES ${result.legalFees.toLocaleString()}
TOTAL: KES ${result.total.toLocaleString()}

Date: ${currentDate}

Download Mkaazi Navigator for property calculations: [Your App URL]`;
  }
  
  shareViaWhatsApp(shareText);
};

export const shareApp = () => {
  const shareText = `⚖️ MKAAZI NAVIGATOR - Your Legal Rights Guardian

Get free legal help for:
• Tenant rights and eviction protection
• Property stamp duty calculator
• Free legal aid directory
• Download legal notices

Download now: [Your App URL]`;
  
  shareViaWhatsApp(shareText);
};