import { create } from 'zustand';

type Language = 'en' | 'sw' | 'sheng';

interface AppState {
  language: Language;
  currentStep: string;
  verdict: any;
  setLanguage: (lang: Language) => void;
  setCurrentStep: (step: string) => void;
  setVerdict: (verdict: any) => void;
  resetFlow: () => void;
}

const questions: any = {
  notice_verification: {
    question: {
      en: "Has your landlord issued a formal written eviction notice?",
      sw: "Je, mwenye nyumba amekupa ilani rasmi ya maandishi?",
      sheng: "Landlord amekuchorea notice yoyote ya maandishi?"
    },
    options: [
      {
        text: {
          en: "No, they locked me out without notice",
          sw: "Hapana, alinifungia mlango bila ilani",
          sheng: "Zii, ameweka tu kufuli bila kuniambia"
        },
        next_step: "verdict_illegal_lockout",
        verdict: {
          type: "danger",
          message: {
            en: "⚠️ ILLEGAL LOCKOUT! Your landlord cannot lock you out without a court order and 30 days written notice.",
            sw: "⚠️ KUFUNGWA BILA HALAL! Mwenye nyumba hawezi kukufungia nje bila amri ya mahakama na ilani ya siku 30.",
            sheng: "⚠️ ILLEGAL LOCKOUT! Landlord hawezi kukuwekea kufuli bila court order na notice ya mwezi mmoja."
          }
        }
      },
      {
        text: {
          en: "Yes, I received a written notice",
          sw: "Ndio, nilipata ilani ya maandishi",
          sheng: "Eeh, ameshia na barua"
        },
        next_step: "timeline_check"
      }
    ]
  },
  timeline_check: {
    question: {
      en: "How many days notice did the letter specify?",
      sw: "Ilani ilitaja siku ngapi?",
      sheng: "Hiyo barua inasema uondoke baada ya siku ngapi?"
    },
    options: [
      {
        text: {
          en: "Less than 30 days",
          sw: "Chini ya siku 30",
          sheng: "Chini ya mwezi mmoja"
        },
        verdict: {
          type: "warning",
          message: {
            en: "⚠️ INVALID NOTICE! The law requires minimum 30 days written notice.",
            sw: "⚠️ ILANI BATILI! Sheria inahitaji ilani ya siku 30.",
            sheng: "⚠️ NOTICE INVALID! Sheria inataka mwezi mmoja notice."
          }
        }
      },
      {
        text: {
          en: "30 days or more",
          sw: "Siku 30 au zaidi",
          sheng: "Mwezi mmoja ama zaidi"
        },
        verdict: {
          type: "success",
          message: {
            en: "✓ Valid notice period. Your landlord followed the legal requirement.",
            sw: "✓ Ilani sahihi. Mwenye nyumba amefuata sheria.",
            sheng: "✓ Notice ni sahihi. Landlord amefuata sheria."
          }
        }
      }
    ]
  }
};

export const useStore = create<AppState>((set) => ({
  language: 'en',
  currentStep: 'notice_verification',
  verdict: null,
  setLanguage: (lang) => set({ language: lang }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setVerdict: (verdict) => set({ verdict }),
  resetFlow: () => set({ currentStep: 'notice_verification', verdict: null })
}));

export { questions };
