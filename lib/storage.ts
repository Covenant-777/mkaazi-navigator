export interface SavedCalculation {
  id: string;
  type: 'tenant' | 'buyer';
  date: string;
  data: any;
  language: string;
}

const STORAGE_KEY = 'mkaazi_calculations';

export const saveCalculation = (type: 'tenant' | 'buyer', data: any, language: string): void => {
  try {
    const existing = getSavedCalculations();
    const newCalculation: SavedCalculation = {
      id: Date.now().toString(),
      type,
      data,
      language,
      date: new Date().toISOString(),
    };
    
    const updated = [newCalculation, ...existing].slice(0, 20); // Keep last 20
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving calculation:', error);
  }
};

export const getSavedCalculations = (): SavedCalculation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
};

export const deleteCalculation = (id: string): void => {
  try {
    const existing = getSavedCalculations();
    const filtered = existing.filter(calc => calc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting calculation:', error);
  }
};

export const clearAllCalculations = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};