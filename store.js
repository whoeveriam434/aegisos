import { create } from "zustand";

const useScamStore = create((set) => ({
  isScamActive: false,
  scamType: "",
  frictionTimer: 0,
  userSettings: {
    coolingOffPeriod: 300,
    trustedContact: "",
  },

  triggerScam: (type) =>
    set({
      isScamActive: true,
      scamType: type,
    }),

  resetScam: () =>
    set({
      isScamActive: false,
      scamType: "",
      frictionTimer: 0,
    }),

  setTimer: (seconds) =>
    set({
      frictionTimer: seconds,
    }),

  updateSettings: (settings) =>
    set((state) => ({
      userSettings: {
        ...state.userSettings,
        ...settings,
      },
    })),
}));

export default useScamStore;
