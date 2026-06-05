import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.cdnfonts.com/s/14882/Helvetica.woff', fontStyle: 'normal', fontWeight: 'normal' },
    { src: 'https://fonts.cdnfonts.com/s/14882/Helvetica-Bold.woff', fontStyle: 'normal', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  refNumber: {
    fontSize: 10,
    color: '#999',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    marginBottom: 10,
    lineHeight: 1.5,
  },
  noticeBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderLeft: 4,
    borderLeftColor: '#ffc107',
    borderLeftWidth: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  table: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  tableLabel: {
    width: '40%',
    fontWeight: 'bold',
  },
  tableValue: {
    width: '60%',
  },
  warningBox: {
    padding: 12,
    backgroundColor: '#f8d7da',
    borderLeft: 4,
    borderLeftColor: '#dc3545',
    marginVertical: 15,
  },
  successBox: {
    padding: 12,
    backgroundColor: '#d4edda',
    borderLeft: 4,
    borderLeftColor: '#28a745',
    marginVertical: 15,
  },
});

interface LegalPDFProps {
  type: 'tenant' | 'buyer';
  data: any;
  language: string;
}

export const LegalPDF = ({ type, data, language }: LegalPDFProps) => {
  const currentDate = new Date().toLocaleDateString();
  const refNumber = `MKAAZI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const translations = {
    en: {
      title: 'MKAAZI NAVIGATOR - LEGAL DOCUMENT',
      issuedBy: 'Mkaazi Navigator Legal Aid',
      ref: 'Reference Number',
      date: 'Date Issued',
      caseDetails: 'Case Details',
      legalNotice: 'LEGAL NOTICE',
      disclaimer: 'Disclaimer: This is an AI-generated legal guidance document. For complex cases, please consult a licensed Kenyan advocate.',
      footer: 'Mkaazi Navigator - Empowering Kenyan Citizens through Legal Access',
      tenant: {
        scenario: 'Tenant Protection Scenario',
        violation: 'Legal Violation Detected',
        recommendation: 'Recommended Actions',
        action1: 'Document all communication with your landlord',
        action2: 'Take photos/videos as evidence',
        action3: 'Report to the nearest police station',
        action4: 'Contact the Rent Restriction Tribunal',
        action5: 'Seek free legal aid from Kituo cha Sheria',
      },
      buyer: {
        scenario: 'Property Purchase Estimate',
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
      },
    },
    sw: {
      title: 'MKAAZI NAVIGATOR - HATI YA KISHERIA',
      issuedBy: 'Msaada wa Kisheria wa Mkaazi Navigator',
      ref: 'Namba ya Kumbukumbu',
      date: 'Tarehe Iliyotolewa',
      caseDetails: 'Maelezo ya Kesi',
      legalNotice: 'NOTISI YA KISHERIA',
      disclaimer: 'Kanusho: Hii ni hati ya mwongozo wa kisheria iliyotengenezwa na AI. Kwa kesi ngumu, tafuta wakili aliyeidhinishwa wa Kenya.',
      footer: 'Mkaazi Navigator - Kuwapa Nguvu Wananchi wa Kenya kwa Upatikanaji wa Sheria',
      tenant: {
        scenario: 'Hali ya Ulinzi wa Mpangaji',
        violation: 'Ukiukaji wa Sheria Umegunduliwa',
        recommendation: 'Hatua Zinazopendekezwa',
        action1: 'Andika mawasiliano yote na mwenye nyumba',
        action2: 'Piga picha/video kama ushahidi',
        action3: 'Ripoti kwa kituo cha karibu cha polisi',
        action4: 'Wasiliana na Mahakama ya Kukodisha',
        action5: 'Tafuta msaada wa kisheria bure kutoka Kituo cha Sheria',
      },
      buyer: {
        scenario: 'Makadirio ya Ununuzi wa Nyumba/Kiwanja',
        propertyDetails: 'Maelezo ya Nyumba/Kiwanja',
        costBreakdown: 'Uchambuzi wa Gharama',
        stampDuty: 'Stamp Duty',
        legalFees: 'Ada ya Kisheria (Makadirio)',
        totalCost: 'Jumla ya Gharama Makadirio',
        nextSteps: 'Hatua Zinazofuata Zinazopendekezwa',
        step1: 'Thibitisha hati ya ardhi kwenye ArdhiSasa',
        step2: 'Fanya utafiti wa kina na mamlaka za mitaa',
        step3: 'Wasiliana na wakili aliyeidhinishwa',
        step4: 'Saini makubaliano ya uuzaji baada ya uthibitisho',
      },
    },
    sheng: {
      title: 'MKAAZI NAVIGATOR - LEGAL DOCUMENT',
      issuedBy: 'Mkaazi Navigator Legal Aid',
      ref: 'Reference Number',
      date: 'Date Issued',
      caseDetails: 'Case Details',
      legalNotice: 'LEGAL NOTICE',
      disclaimer: 'Disclaimer: Hii ni AI-generated legal guidance. For complex cases, consult licensed Kenyan advocate.',
      footer: 'Mkaazi Navigator - Empowering Kenyan Citizens through Legal Access',
      tenant: {
        scenario: 'Tenant Protection Scenario',
        violation: 'Legal Violation Detected',
        recommendation: 'Recommended Actions',
        action1: 'Document all communication with landlord',
        action2: 'Take photos/videos as evidence',
        action3: 'Report to nearest police station',
        action4: 'Contact Rent Restriction Tribunal',
        action5: 'Seek free legal aid from Kituo cha Sheria',
      },
      buyer: {
        scenario: 'Property Purchase Estimate',
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
      },
    },
  };

  const t = translations[language];
  const isTenant = type === 'tenant';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.issuedBy}</Text>
          <Text style={styles.refNumber}>{t.ref}: {refNumber}</Text>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text>{t.date}: {currentDate}</Text>
        </View>

        {/* Main Content */}
        {isTenant ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.tenant.scenario}</Text>
              
              <View style={data.verdict.type === 'danger' || data.verdict.type === 'warning' ? styles.warningBox : styles.successBox}>
                <Text style={styles.label}>{t.tenant.violation}</Text>
                <Text>{data.verdict.message}</Text>
              </View>
              
              <Text style={styles.label}>{t.tenant.recommendation}:</Text>
              {t.tenant.action1 && <Text>• {t.tenant.action1}</Text>}
              {t.tenant.action2 && <Text>• {t.tenant.action2}</Text>}
              {t.tenant.action3 && <Text>• {t.tenant.action3}</Text>}
              {t.tenant.action4 && <Text>• {t.tenant.action4}</Text>}
              {t.tenant.action5 && <Text>• {t.tenant.action5}</Text>}
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.buyer.scenario}</Text>
              
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Property Value:</Text>
                  <Text style={styles.tableValue}>KES {data.propertyValue.toLocaleString()}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Property Type:</Text>
                  <Text style={styles.tableValue}>{data.propertyType === 'urban' ? 'Urban (City/Municipality)' : 'Rural (Agricultural Land)'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>{t.buyer.stampDuty} ({data.rate}%):</Text>
                  <Text style={styles.tableValue}>KES {data.stampDuty.toLocaleString()}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>{t.buyer.legalFees}:</Text>
                  <Text style={styles.tableValue}>KES {data.legalFees.toLocaleString()}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>{t.buyer.totalCost}:</Text>
                  <Text style={styles.tableValue}>KES {data.total.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.buyer.nextSteps}</Text>
              {t.buyer.step1 && <Text>1. {t.buyer.step1}</Text>}
              {t.buyer.step2 && <Text>2. {t.buyer.step2}</Text>}
              {t.buyer.step3 && <Text>3. {t.buyer.step3}</Text>}
              {t.buyer.step4 && <Text>4. {t.buyer.step4}</Text>}
            </View>
          </>
        )}

        {/* Legal Notice */}
        <View style={styles.noticeBox}>
          <Text style={styles.label}>{t.legalNotice}</Text>
          <Text>{t.disclaimer}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{t.footer}</Text>
        </View>
      </Page>
    </Document>
  );
};