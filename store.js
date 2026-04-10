import { create } from "zustand";

const useStore = create((set) => ({
  // States
  isScamActive: false,
  scamType: null, // 'whatsapp', 'fake_call', 'payme_scam'
  frictionTimer: 0,
  currentApp: null, // The app user was trying to use

  userSettings: {
    coolingOffPeriod: 3, // minutes
    trustedContact: null,
    protectionEnabled: true,
  },

  // Demo balance removed - not needed for hackathon

  // Actions
  triggerScam: (type, duration, appContext = null) =>
    set({
      isScamActive: true,
      scamType: type,
      frictionTimer: duration,
      currentApp: appContext,
    }),

  resetScam: () =>
    set({
      isScamActive: false,
      scamType: null,
      frictionTimer: 0,
      currentApp: null,
    }),

  setTimer: (seconds) => set({ frictionTimer: seconds }),

  updateSettings: (newSettings) =>
    set((state) => ({
      userSettings: { ...state.userSettings, ...newSettings },
    })),
}));

export default useStore;
