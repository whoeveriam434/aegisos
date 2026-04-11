import { create } from "zustand";

const useStore = create((set) => ({
  // States
  isScamActive: false,
  scamType: null,
  frictionTimer: 0,
  currentApp: null,
  activeDetectionDetails: null,

  // User settings
  userSettings: {
    coolingOffPeriod: 3,
    protectionEnabled: true,
  },

  // Trusted Contacts
  trustedContacts: [],

  // Privacy settings
  privacySettings: {
    enablePersonalPatterns: true, // Default ON for demo
    patternsLearned: false,
    learningProgress: 0,
    lastLearningDate: null,
  },

  // Learned patterns storage
  learnedPatterns: {
    family: null,
    bank: null,
  },

  // Family Circle
  familyCircle: [],

  // Actions
  triggerScam: (type, duration, appContext = null, detectionDetails = null) =>
    set({
      isScamActive: true,
      scamType: type,
      frictionTimer: duration,
      currentApp: appContext,
      activeDetectionDetails: detectionDetails,
    }),

  resetScam: () =>
    set({
      isScamActive: false,
      scamType: null,
      frictionTimer: 0,
      currentApp: null,
      activeDetectionDetails: null,
    }),

  setTimer: (seconds) => set({ frictionTimer: seconds }),

  updateSettings: (newSettings) =>
    set((state) => ({
      userSettings: { ...state.userSettings, ...newSettings },
    })),

  // Privacy actions
  setPersonalPatternsEnabled: (enabled) =>
    set((state) => ({
      privacySettings: {
        ...state.privacySettings,
        enablePersonalPatterns: enabled,
      },
    })),

  updateLearningProgress: (progress) =>
    set((state) => ({
      privacySettings: { ...state.privacySettings, learningProgress: progress },
    })),

  setPatternsLearned: (patterns) =>
    set((state) => ({
      privacySettings: {
        ...state.privacySettings,
        patternsLearned: true,
        lastLearningDate: new Date().toISOString(),
      },
      learnedPatterns: { ...state.learnedPatterns, ...patterns },
    })),

  clearLearnedPatterns: () =>
    set((state) => ({
      privacySettings: {
        ...state.privacySettings,
        patternsLearned: false,
        learningProgress: 0,
      },
      learnedPatterns: { family: null, bank: null },
    })),

  // Family Circle actions
  addFamilyContact: (name, phone) =>
    set((state) => ({
      familyCircle: [...state.familyCircle, { id: Date.now(), name, phone }],
    })),

  removeFamilyContact: (id) =>
    set((state) => ({
      familyCircle: state.familyCircle.filter((contact) => contact.id !== id),
    })),

  // Trusted Contacts actions
  addTrustedContact: (name, phone) =>
    set((state) => ({
      trustedContacts: [...state.trustedContacts, { id: Date.now(), name, phone }],
    })),

  removeTrustedContact: (id) =>
    set((state) => ({
      trustedContacts: state.trustedContacts.filter((contact) => contact.id !== id),
    })),

  notifyFamily: (message, contactName) => {
    console.log(`Family notified: ${contactName}`);
    return true;
  },
}));

export default useStore;
