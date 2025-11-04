// Helper per controllare se siamo in Tauri e aprire link esterni
export const isTauri = () => {
  return typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
};

export const openExternalUrl = async (url) => {
  if (isTauri()) {
    try {
      // In Tauri v2, l'API è diversa
      const { invoke } = window.__TAURI_INTERNALS__;
      await invoke('open_url', { url });
    } catch (error) {
      console.error('Failed to open URL via Tauri:', error);
      // Fallback in caso di errore
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } else {
    // Fallback per browser normale
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
