export async function loadGis(): Promise<void> {
  if ((window as any).google?.accounts?.oauth2) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true; s.defer = true;
    s.onload = () => { console.debug('[GIS] loaded'); resolve(); };
    s.onerror = () => reject(new Error('[GIS] failed to load'));
    document.head.appendChild(s);
  });
}

export async function loadGapiPicker(): Promise<void> {
  if ((window as any).gapi?.picker) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.async = true; s.defer = true;
    s.onload = () => {
      console.debug('[GAPI] api.js loaded, loading picker...');
      (window as any).gapi.load('picker', {
        callback: () => { console.debug('[GAPI] picker loaded'); resolve(); },
        onerror: () => reject(new Error('[GAPI] picker failed to load')),
      });
    };
    s.onerror = () => reject(new Error('[GAPI] api.js failed to load'));
    document.head.appendChild(s);
  });
}
