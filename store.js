import { create } from "zustand";

const useStore = create((set) => ({
  // States
  isScamActive: false,
  scamType: null, // 'whatsapp', 'fake_call', 'payme_scam', 'user_activated'
  frictionTimer: 0,
  currentApp: null,

  // User settings
  userSettings: {
    coolingOffPeriod: 3, // minutes
    trustedContact: null,
    protectionEnabled: true,
  },

  // NEW: Family Circle (Trusted contacts for notifications)
  familyCircle: [],

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

  // NEW: Family Circle actions
  addFamilyContact: (name, phone) =>
    set((state) => ({
      familyCircle: [...state.familyCircle, { id: Date.now(), name, phone }],
    })),

  removeFamilyContact: (id) =>
    set((state) => ({
      familyCircle: state.familyCircle.filter((contact) => contact.id !== id),
    })),

  // NEW: Simulated family notification (for demo)
  notifyFamily: (message, contactName) => {
    console.log(`📱 [SIMULATED] Notifying ${contactName}: ${message}`);
    return true;
  },
}));

export default useStore;
