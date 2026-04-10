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
    // #region agent log
    fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix",hypothesisId:"H4",location:"store.js:17",message:"triggerScam input types",data:{typeValue:type,typeType:typeof type,durationValue:duration,durationType:typeof duration},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
    // #region agent log
    fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix",hypothesisId:"H1",location:"store.js:38",message:"updateSettings payload types",data:{newSettings,newSettingsType:typeof newSettings,protectionEnabledType:typeof newSettings?.protectionEnabled},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    set((state) => ({
      userSettings: { ...state.userSettings, ...newSettings },
    }));
  },

  setBalance: (amount) => {
    set({ balance: amount });
  },
}));

export default useStore;
