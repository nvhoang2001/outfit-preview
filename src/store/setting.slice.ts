import { create } from 'zustand';

interface ISettingStore {
  isDarkMode: boolean;
  isAdvancedMode: boolean;
  localeLang: string;

  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsAdvancedMode: (isAdvancedMode: boolean) => void;
  setActiveLocaleLang: (localeLang: string) => void;
}

const useSettingStore = create<ISettingStore>(set => ({
  isDarkMode: false,
  isAdvancedMode: false,
  localeLang: 'en',
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
  setIsAdvancedMode: (isAdvancedMode: boolean) => set({ isAdvancedMode }),
  setActiveLocaleLang: (localeLang: string) => set({ localeLang }),
}));

export default useSettingStore;
