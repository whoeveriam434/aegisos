import { create } from "zustand";

const useStore = create((set) => ({
  // States
  isScamActive: false,
  scamType: null,
  frictionTimer: 0,
  balance: 12480,
  userSettings: {
    coolingOffPeriod: 3,
    trustedContact: null,
    protectionEnabled: true,
  },

  // Actions
  triggerScam: (type, duration) => {
    set({
      isScamActive: true,
      scamType: type,
      frictionTimer: duration,
    });
  },

  resetScam: () => {
    set({
      isScamActive: false,
      scamType: null,
      frictionTimer: 0,
    });
  },

  setTimer: (seconds) => {
    set({ frictionTimer: seconds });
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      userSettings: { ...state.userSettings, ...newSettings },
    }));
  },

  setBalance: (amount) => {
    set({ balance: amount });
  },
}));

export default useStore;
