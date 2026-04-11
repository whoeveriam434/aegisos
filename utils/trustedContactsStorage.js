import AsyncStorage from "@react-native-async-storage/async-storage";

const TRUSTED_CONTACTS_KEY = "@aegis/trustedContacts";

function toContactObject(entry) {
  if (typeof entry === "string") {
    return {
      id: entry,
      name: entry,
      phone: "",
    };
  }
  if (entry && typeof entry === "object") {
    return {
      id: entry.id || `${entry.name || ""}:${entry.phone || ""}`,
      name: entry.name || "",
      phone: entry.phone || "",
    };
  }
  return null;
}

export async function getTrustedContacts() {
  try {
    // #region agent log
    console.log("[dbg:H3] getTrustedContacts start");
    // #endregion
    const raw = await AsyncStorage.getItem(TRUSTED_CONTACTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // #region agent log
    console.log("[dbg:H3] getTrustedContacts parsed", {
      parsedIsArray: Array.isArray(parsed),
      parsedCount: Array.isArray(parsed) ? parsed.length : -1,
    });
    // #endregion
    if (!Array.isArray(parsed)) return [];
    return parsed.map(toContactObject).filter(Boolean);
  } catch (error) {
    // #region agent log
    console.log("[dbg:H3] getTrustedContacts failed", {
      errorName: error?.name,
      errorMessage: error?.message,
    });
    // #endregion
    return [];
  }
}

export async function saveTrustedContacts(contacts) {
  // #region agent log
  console.log("[dbg:H3] saveTrustedContacts start", {
    count: contacts?.length,
  });
  // #endregion
  await AsyncStorage.setItem(TRUSTED_CONTACTS_KEY, JSON.stringify(contacts));
  // #region agent log
  console.log("[dbg:H3] saveTrustedContacts complete");
  // #endregion
}

export async function addTrustedContact(contactInput) {
  // #region agent log
  console.log("[dbg:H3] storage addTrustedContact called", {
    contactType: typeof contactInput,
    contactLength: contactInput?.length,
  });
  fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix-contact",hypothesisId:"H3",location:"trustedContactsStorage.js:21",message:"addTrustedContact called",data:{contactType:typeof contactInput,contactLength:contactInput?.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const existing = await getTrustedContacts();
  const name = (contactInput?.name || "").trim();
  const phone = (contactInput?.phone || "").trim();
  if (!name || !phone) return existing;

  const id = `${name}:${phone}`;
  const nextContact = { id, name, phone };
  const updated = existing.some((item) => item.id === id)
    ? existing
    : [...existing, nextContact];
  await saveTrustedContacts(updated);
  // #region agent log
  console.log("[dbg:H3] storage addTrustedContact saved", {
    updatedCount: updated.length,
  });
  fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix-contact",hypothesisId:"H3",location:"trustedContactsStorage.js:31",message:"addTrustedContact saved",data:{updatedCount:updated.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return updated;
}

export async function removeTrustedContact(contactId) {
  const existing = await getTrustedContacts();
  const updated = existing.filter((item) => item.id !== contactId);
  await saveTrustedContacts(updated);
  return updated;
}
