import { SUPPORTS_AI_MODELS } from '@/constants/support-ai-models';
import { create } from 'zustand';

interface ISettingStore {
  isDarkMode: boolean;
  isAdvancedMode: boolean;
  localeLang: string;
  activeModel: string;

  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsAdvancedMode: (isAdvancedMode: boolean) => void;
  setActiveLocaleLang: (localeLang: string) => void;
}

const useSettingStore = create<ISettingStore>(set => ({
  isDarkMode: false,
  isAdvancedMode: false,
  localeLang: 'en',
  activeModel: SUPPORTS_AI_MODELS.GOOGLE_GEMINI,

  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
  setIsAdvancedMode: (isAdvancedMode: boolean) => set({ isAdvancedMode }),
  setActiveLocaleLang: (localeLang: string) => set({ localeLang }),
  saveSetting: (setting: Partial<ISettingStore>) => set(setting),
}));

export default useSettingStore;
