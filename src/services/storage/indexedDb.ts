const STORE = "tasbeeh";

/**
 * IndexedDB (Simulated via LocalStorage for MVP)
 * 
 * Provides local persistence for tasbeeh data.
 * Will be upgraded to real IndexedDB (Dexie) in a later phase.
 */
export const saveTasbeeh = async (data: any) => {
  localStorage.setItem(STORE, JSON.stringify(data));
};

export const getTasbeeh = async () => {
  const data = localStorage.getItem(STORE);
  return data ? JSON.parse(data) : null;
};
